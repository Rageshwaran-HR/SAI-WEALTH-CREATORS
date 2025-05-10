import { Link } from 'wouter';
import { newsItems } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const NewsInsights = () => {
  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-primary mb-3">Latest Financial News & Insights</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Stay informed with our latest articles, market updates, and investment insights.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {newsItems.map((article) => (
            <Card key={article.id} className="bg-white shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200">
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center mb-2">
                  <Badge variant="secondary" className="bg-primary text-white mr-2">{article.category}</Badge>
                  <span className="text-gray-500 text-sm">{article.date}</span>
                </div>
                <h3 className="font-montserrat font-bold text-xl text-primary mb-2">
                  {article.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {article.excerpt}
                </p>
                <Link href={`/news/${article.slug}`} className="text-secondary font-bold hover:underline flex items-center">
                  Read More <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button 
            className="bg-primary hover:bg-primary/90 text-white font-bold"
            asChild
          >
            <Link href="/news">View All Articles</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NewsInsights;
