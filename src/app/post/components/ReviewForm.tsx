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
import { Toaster, toast } from "sonner";
import api from "@/lib/api";
import axios from "axios";
import {
  getSignedUrl,
  onUploadSuccess,
  onUploadVideoThumbnail,
} from "@/apis/post";
import { useRouter } from "next/navigation";

const STEPS = [
  { number: 1, title: "Upload Video" },
  { number: 2, title: "Review Details" },
  { number: 3, title: "Rate Experience" },
  { number: 4, title: "Preview & Submit" },
];

const INITIAL_QUESTIONS: Question[] = [
  { id: "price", text: "Price", rating: 0 },
  { id: "Quality", text: "Quality", rating: 0 },
  { id: "Valueformoney", text: "Value For Money", rating: 0 },
];

export function ReviewForm() {
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

  const router = useRouter();

  console.log("checking videoUrl", thumbnailFile);

  const averageRating =
    questions.reduce((acc, q) => acc + q.rating, 0) / questions.length;
  const isStepTwoValid =
    title && category && description && location && thumbnailUrl;
  // const isStepThreeValid = questions.every((q) => q.rating > 0 && q.feedback.trim().length > 0);

  const updateQuestion = (index: number, updates: Partial<Question>) => {
    setQuestions(
      questions.map((q, i) => (i === index ? { ...q, ...updates } : q))
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
          // acc[curr.id] = { value: curr.feedback, rating: curr.rating };
          return acc;
        },
        {} as Record<string, { value: string; rating: number }>
      );

      // Get file extension
      const ext = videoFile.name.split(".").pop() || "";

      const body = {
        ext,
        desc: description,
        hashtags: [],
        tags: [],
        latitude: 90,
        longitude: 90,
        isSponsored: false,
        isAdvertisement: false,
        isProduct: category === "product",
        isService: category === "service",
        isPlaces: category === "place",
        title,
        uploaderRating: ratingsObject,
      };

      // Get signed URL
      const { data } = await getSignedUrl(body);
      console.log("checking data of signed url of signed url", data);
      if (data.isSignedURL) {
        setShowSuccess(true);
        console.log("checking code execution", data?.videoId);
        // Trigger onUploadSuccess after receiving a signed URL
        if (data?.videoId) {
          try {
            const res = await onUploadSuccess(data.videoId);
            console.log("Response from onUploadSuccess:", res);
            const formData = new FormData();
            formData.append("image", thumbnailFile);
            const thumbnailRes = await onUploadVideoThumbnail(
              data?.videoId,
              formData
            );
          } catch (error) {
            console.error("Error in onUploadSuccess:", error);
          }
        }
      }

      // Upload video to signed URL
      // await axios.put(data.data.location, videoFile, {
      //   headers: {
      //     "Content-Type": videoFile.type,
      //   },
      //   maxBodyLength: Infinity,
      // });

      // Upload thumbnail
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Share Your Video Review</h2>
            <VideoUploader
              onUploadComplete={(url, file) => {
                setVideoUrl(url);
                setVideoFile(file);
                setStep(2);
              }}
            />
          </div>
        );
      case 2:
        return (
          <div
            style={{
              // background:"red",
              height: "80vh",
              overflowY: "scroll",
              padding: "12px",
              // overflowY:'hidden'
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
              onTitleChange={setTitle}
              onCategoryChange={setCategory}
              onDescriptionChange={setDescription}
              onLocationChange={setLocation}
              onThumbnailUpload={(url, file) => {
                setThumbnailUrl(url);
                setThumbnailFile(file);
              }}
            />
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={() => setStep(3)} disabled={!isStepTwoValid}>
                Next
              </Button>
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
              <Button
                onClick={() => setStep(4)}
                // disabled={!isStepThreeValid}
              >
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
                  {/* <Toaster richColors /> */}
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
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* <div className="text-center mb-12">
            <div className="flex">
              <div className="w-full flex">
                <Button onClick={() => router.push("/home")}>
                  Back to Home
                </Button>
                <h1 className="text-4xl font-bold mb-4 w-full">
                  Share Your Experience
                </h1>
              </div>
            </div>

            <p className="text-muted-foreground text-lg">
              Help others by sharing your honest review through video
            </p>
          </div> */}

          <div className="flex flex-col md:flex-row gap-8">
            <StepIndicator currentStep={step} steps={STEPS} />

            <div className="flex-1 flex gap-8">
              {videoUrl && (
                <div className="hidden md:block w-72">
                  <div className="sticky top-8">
                    <VideoPreview videoUrl={videoUrl} />
                  </div>
                </div>
              )}

              <Card className="flex-1 p-6">
                {videoUrl && (
                  <div className="md:hidden mb-6">
                    <VideoPreview videoUrl={videoUrl} />
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
