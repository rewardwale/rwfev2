"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { StarRating } from "./StarRating";
import { VideoUploader } from "./VideoUploader";
import { ReviewDetails } from "./ReviewDetails";
import { Card } from "@/components/ui/card";
import { QuestionRating, Question } from "./QuestionRating";
import { StepIndicator } from "./StepIndicator";
import { VideoPreview } from "./VideoPreview";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import axios from "axios";
import {
  getSignedUrl,
  onUploadSuccess,
  onUploadVideoThumbnail,
} from "@/apis/post";
import { useRouter, useSearchParams } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import Loader from "@/components/ui/loader";
import { getStoredLocation } from "@/lib/utils";

const STEPS = [
  { number: 1, title: "Upload Video" },
  { number: 2, title: "Review Details" },
  { number: 3, title: "Rate Experience" },
  { number: 4, title: "Preview & Submit" },
];

const INITIAL_QUESTIONS: Question[] = [
  { id: "1", text: "Price", rating: 0 },
  { id: "2", text: "Quality", rating: 0 },
  { id: "3", text: "Value For Money", rating: 0 },
];

export function ReviewForm() {
  const searchParams = useSearchParams();
  const businessID = searchParams.get("data") || "";
  const [step, setStep] = useState(1);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [questions, setQuestions] = useState<Question[]>(INITIAL_QUESTIONS);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  const router = useRouter();
  const isMobile = useIsMobile();

  const averageRating =
    questions.reduce((acc, q) => acc + q.rating, 0) / questions.length;
  const isStepTwoValid =
    title && category && description && location && thumbnailUrl;
  const isStepThreeValid = questions.every((q) => q.rating > 0);

  const updateQuestion = (index: number, updates: Partial<Question>) => {
    setQuestions(
      questions.map((q, i) => (i === index ? { ...q, ...updates } : q)),
    );
  };

  const handleSubmit = async () => {
    if (!videoFile || !thumbnailFile) {
      toast.error("Video and thumbnail are required");
      return;
    }

    setIsLoading(true);

    try {
      // Convert ratings to the required format
      const ratingsObject = questions.reduce(
        (acc, curr) => {
          acc[curr.id] = { value: curr.text, rating: curr.rating };
          return acc;
        },
        {} as Record<string, { value: string; rating: number }>,
      );

    const [latitude, longitude] = getStoredLocation();
      // Get file extension
      const ext = videoFile.name.split(".").pop() || "";

      const body = {
        ext,
        desc: description,
        hashtags,
        tags,
        latitude: latitude,
        longitude: longitude,
        isProduct: category === "product",
        isService: category === "service",
        isPlaces: category === "place",
        title,
        uploaderRating: ratingsObject,
        ...(businessID && { businessPageId: businessID }),
      };

      // Get signed URL
      const { data } = await getSignedUrl(body);
      if (data.isSignedURL) {
        const videoUpload = await axios.put(data?.location, videoFile, {
          headers: {
            "Content-Type": videoFile.type,
          },
          maxBodyLength: Infinity,
        });
        // Trigger onUploadSuccess after receiving 200 status from videoUpload
        if (videoUpload.status === 200) {
          try {
            // const res = await onUploadSuccess(data.videoId);
            const formData = new FormData();
            formData.append("image", thumbnailFile);
            const thumbnailRes = await onUploadVideoThumbnail(
              data?.videoId,
              formData,
            );
          } catch (error) {
            console.error("Error in onUploadSuccess:", error);
          }
        }
      }
    } finally {
      setIsLoading(false);
      setShowSuccess(true);
    }
  };

  const handleHashtagsChange = (newHashtags: string[]) => {
    setHashtags(newHashtags);
  };

  const handleTagsChange = (newTags: string[]) => {
    setTags(newTags);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div
            className="space-y-4"
            style={{
              minHeight: `${isMobile && "20vh"}`,
            }}
          >
            {isMobile && videoUrl ? (
              <div className="space-y-4">
                {/* <VideoPreview videoUrl={videoUrl} /> */}
              </div>
            ) : (
              // Show video uploader if no video or on desktop
              <div>
                <h2 className="text-2xl font-semibold">
                  Share Your Video Review
                </h2>
                <VideoUploader
                  hasExistingVideo={!!videoUrl}
                  onUploadComplete={(url, file) => {
                    setVideoUrl(url);
                    setVideoFile(file);
                    toast.success(
                      "Video uploaded successfully! Click Next to continue.",
                    );
                  }}
                />
              </div>
            )}
            {videoUrl && (
              <>
                <div className="md:hidden">
                  {/* <VideoPreview videoUrl={videoUrl} /> */}
                </div>
                <div className="flex justify-end gap-4 mb-8">
                  {isMobile && videoUrl && (
                    <Button
                      onClick={() => {
                        setVideoUrl("");
                        setVideoFile(null);
                      }}
                    >
                      Change Video
                    </Button>
                  )}
                  <Button onClick={() => setStep(2)}>Next</Button>
                </div>
              </>
            )}
          </div>
        );
      case 2:
        return (
          <div 
          style={{
            height: "100%",
          }}
          >
            <div
              style={{
                height: `${!isMobile && "88vh"}`,
                overflowY: "scroll",
                padding: "20px",
                // overflowY:'hidden'
                minHeight: `${isMobile && "100vh"}`,
                marginBottom: `${isMobile && "20px"}`,
              }}
              className="space-y-6 scrollbar-hide"
            >
              <h2 className="text-2xl font-semibold">Review Details</h2>
              <ReviewDetails
                title={title}
                category={category}
                description={description}
                location={location}
                thumbnailUrl={thumbnailUrl}
                videoUrl={videoUrl}
                onTitleChange={setTitle}
                onCategoryChange={setCategory}
                onDescriptionChange={setDescription}
                onLocationChange={setLocation}
                onThumbnailUpload={(url, file) => {
                  setThumbnailUrl(url);
                  setThumbnailFile(file);
                }}
                onHashtagsChange={handleHashtagsChange}
                onTagsChange={handleTagsChange}
                onNext={() => setStep(3)}
                setStep={setStep}
              />
              {/* <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button onClick={() => setStep(3)} disabled={!isStepTwoValid}>
                  Next
                </Button>
              </div> */}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">Rate Your Experience</h2>
              {averageRating > 0 && (
                <div className="flex items-center gap-2">
                  <StarRating
                    value={Math.round(averageRating)}
                    onChange={() => {}}
                  />
                  <span className="text-lg font-medium">
                    {averageRating.toFixed(1)} out of 5
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {questions.map((question, index) => (
                <QuestionRating
                  key={question.id}
                  question={question}
                  onRatingChange={(rating) => updateQuestion(index, { rating })}
                  // onFeedbackChange={(feedback) => updateQuestion(index, { feedback })}
                />
              ))}
            </div>

            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button onClick={() => setStep(4)} disabled={!isStepThreeValid}>
                Next
              </Button>
            </div>
          </div>
        );
      case 4:
        return (
          <div
            className="space-y-6 scrollbar-hide"
            style={{
              height: "80vh",
              overflowY: "scroll",
              padding: "12px",
            }}
          >
            <h2 className="text-2xl font-semibold">Review Your Submission</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">{title}</h3>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Category</p>
                    <p className="capitalize">{category}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p>{location}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Description</p>
                <p>{description}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <p className="font-medium">Overall Rating:</p>
                  <StarRating
                    value={Math.round(averageRating)}
                    onChange={() => {}}
                  />
                  <span className="text-lg">
                    {averageRating.toFixed(1)} out of 5
                  </span>
                </div>

                {questions.map((question) => (
                  <div
                    key={question.id}
                    className="border rounded-lg p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{question.text}</p>
                      <div className="flex items-center gap-2">
                        <StarRating
                          type="static"
                          value={question.rating}
                          onChange={() => {}}
                        />
                        <span className="text-sm">
                          {question.rating} out of 5
                        </span>
                      </div>
                    </div>
                    {/* <p className="text-muted-foreground">{question.feedback}</p> */}
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => setStep(3)}>
                  Back
                </Button>
                <Button onClick={handleSubmit} disabled={isLoading}>
                  {isLoading ? "Uploading..." : "Submit Review"}
                </Button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            {isLoading && <Loader />}
            <StepIndicator currentStep={step} steps={STEPS} />
            {/* for desktop */}
            <div className="flex-1 flex gap-8">
              {videoUrl && (
                <div className="hidden md:block w-72">
                  <div className="sticky top-8">
                    {<VideoPreview videoUrl={videoUrl} />}
                  </div>
                </div>
              )}
              {/* for mobile ui */}
              <Card className="flex-1 p-2">
                {videoUrl && (
                  <div className="md:hidden mb-6">
                    {step === 1 && <VideoPreview videoUrl={videoUrl} />}
                  </div>
                )}
                {renderStepContent()}
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thank you for your review!</DialogTitle>
          </DialogHeader>
          <p>
            Your review has been submitted successfully and will be published
            after verification.
          </p>
          <Button onClick={() => window.location.reload()}>
            Submit Another Review
          </Button>
          <Button onClick={() => router.push("/home")}>Back to home</Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
