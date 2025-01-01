import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Star } from 'lucide-react'
import { Review } from '../types/brands'


export function ReviewCard({ review }: { review: Review }) {
  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <Avatar>
            <AvatarImage src={review.avatar} />
            <AvatarFallback>{review.author[0]}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold">{review.author}</div>
            <div className="flex gap-1">
              {Array.from({ length: review.rating }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
          </div>
        </div>
        <p className="text-gray-600">{review.content}</p>
        <div className="text-sm text-gray-400 mt-4">{review.date}</div>
      </CardContent>
    </Card>
  )
}

