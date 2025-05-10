import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import PageTransition from "@/components/layout/PageTransition";

// Interface for Alpha Vantage news item
interface AlphaVantageNewsItem {
  title: string;
  url: string;
  time_published: string;
  authors: string[];
  summary: string;
  banner_image?: string;
  source: string;
  category_within_source: string;
  source_domain: string;
  topics?: Array<{topic: string; relevance_score: string}>;
  overall_sentiment_score?: number;
  overall_sentiment_label?: string;
  ticker_sentiment?: Array<{ticker: string; relevance_score: string; ticker_sentiment_score: string; ticker_sentiment_label: string}>;
}

// Interface for Financial Modeling Prep news item
interface FMPNewsItem {
  symbol: string;
  publishedDate: string;
  title: string;
  image: string;
  site: string;
  text: string;
  url: string;
}

// Unified news item interface for our app
interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  image: string;
  url: string;
  source?: string;
  slug: string;
}

// Generate a slug from a title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .replace(/\s+/gi, '-');
};

// Format a date string to a more readable format
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

// Categories for filtering
const categories = [
  "All Categories",
  "Market News",
  "Stocks",
  "Forex",
  "Crypto",
  "Economy",
  "Technology",
  "Finance",
  "Business",
  "International"
];

// Placeholder image for articles without an image
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80";

const News = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(9);
  
  // Fetch Alpha Vantage financial news
  const { 
    data: alphaVantageNews, 
    isLoading: isLoadingAV,
    isError: isErrorAV,
    error: errorAV,
    refetch: refetchAV
  } = useQuery({
    queryKey: ['/api/finance/news/financial'],
    queryFn: async () => {
      try {
        const res = await fetch('/api/finance/news/financial');
        if (!res.ok) throw new Error('Failed to fetch financial news');
        const data = await res.json();
        console.log('Financial news fetched successfully:', data); // Log success
        return data as AlphaVantageNewsItem[];
      } catch (error) {
        console.error('Error fetching financial news:', error);
        throw error; // Ensure the error is propagated
      }
    }
  });
  
// Fetch Financial Modeling Prep market news
const { 
  data: fmpNews, 
  isLoading: isLoadingFMP,
  isError: isErrorFMP,
  error: errorFMP,
  refetch: refetchFMP
} = useQuery({
  queryKey: ['/api/finance/news/market'],
  queryFn: async () => {
    try {
      const res = await fetch('/api/finance/news/market', {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache', // Prevent caching
          Pragma: 'no-cache',          // HTTP 1.0 compatibility
        },
      });

      if (!res.ok) throw new Error('Failed to fetch market news');
      const data = await res.json();

      if (!data || !Array.isArray(data)) {
        console.warn('Market news data is invalid:', data);
        return [];
      }

      console.log('Market news fetched successfully:', data);
      return data;
    } catch (error) {
      console.error('Error fetching market news:', error);
      throw error;
    }
  }
});

  
  // Convert Alpha Vantage news to our unified format
  const processedAlphaVantageNews: NewsItem[] = (alphaVantageNews || []).map((item: AlphaVantageNewsItem, index: number) => {
    // Extract topic with highest relevance as the category
    let category = "Market News";
    if (item.topics && item.topics.length > 0) {
      const sortedTopics = [...item.topics].sort((a, b) => 
        parseFloat(b.relevance_score) - parseFloat(a.relevance_score)
      );
      category = sortedTopics[0].topic;
    }
    
    return {
      id: `av-${index}`,
      title: item.title,
      excerpt: item.summary,
      category,
      date: formatDate(item.time_published),
      image: item.banner_image || DEFAULT_IMAGE,
      url: item.url,
      source: item.source,
      slug: generateSlug(item.title)
    };
  });
  
  // Convert FMP news to our unified format
  const processedFMPNews: NewsItem[] = (fmpNews || []).map((item: FMPNewsItem, index: number) => {
    return {
      id: `fmp-${index}`,
      title: item.title,
      excerpt: item.text,
      category: item.symbol ? "Stocks" : "Market News",
      date: formatDate(item.publishedDate),
      image: item.image || DEFAULT_IMAGE,
      url: item.url,
      source: item.site,
      slug: generateSlug(item.title)
    };
  });
  
  // Combine both news sources
  const allNews = [...processedAlphaVantageNews, ...processedFMPNews];
  
  // Filter news based on search and category
  const filteredNews = allNews.filter(item => {
    const matchesSearch = searchTerm === '' || 
                         item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All Categories' || 
                           item.category.includes(categoryFilter);
    return matchesSearch && matchesCategory;
  });
  
  // Sort news by date (newest first)
  const sortedNews = [...filteredNews].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  
  // Pagination
  const totalPages = Math.ceil(sortedNews.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedNews = sortedNews.slice(startIndex, startIndex + itemsPerPage);
  
  // Loading and error states
  const isLoading = isLoadingAV || isLoadingFMP;
  const isError = isErrorAV || isErrorFMP;
  
  const handleRefetch = () => {
    refetchAV();
    refetchFMP();
  };

  // Animation variants
  const pageTransition = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.3
      }
    }
  };
  
  const itemFadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };
  
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    },
    hover: { 
      y: -10, 
      boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.3 }
    }
  };
  
  const imageHover = {
    hover: { 
      scale: 1.05,
      transition: { duration: 0.5 }
    }
  };

  return (
    <PageTransition>
    <motion.div 
      className="py-16 bg-white"
      initial="hidden"
      animate="visible"
      variants={pageTransition}
    >
      <div className="container mx-auto">
        <motion.div 
          className="text-center mb-12"
          variants={itemFadeIn}
        >
          <h1 className="font-montserrat font-bold text-3xl md:text-5xl text-primary mb-4">Financial News & Insights</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Stay informed with our latest articles, market updates, and investment insights to make better financial decisions.
          </p>
        </motion.div>
        
        {/* Search and Filter Section */}
        <motion.div 
          className="mb-10 bg-gray-100 p-6 rounded-lg"
          variants={itemFadeIn}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-2">
              <Input 
                placeholder="Search articles..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Select 
                value={categoryFilter}
                onValueChange={setCategoryFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Refresh button */}
          {(isLoading || isError) && (
            <motion.div 
              className="flex justify-end mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Button 
                size="sm"
                variant="outline"
                className="flex items-center gap-2"
                onClick={handleRefetch}
                disabled={isLoading}
              >
                <RefreshCw className={cn("h-4 w-4", { "animate-spin": isLoading })} />
                {isLoading ? "Loading..." : "Refresh"}
              </Button>
            </motion.div>
          )}
          
          {/* Error message */}
          {isError && (
            <motion.div 
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mt-4 flex items-start"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Could not load financial news</p>
                <p className="text-sm">Please check your connection or try again later.</p>
              </div>
            </motion.div>
          )}
        </motion.div>
        
        {/* Loading state */}
        {isLoading && (
          <motion.div 
            variants={itemFadeIn}
            className="space-y-8"
          >
            <div className="space-y-3">
              <Skeleton className="h-8 w-64" />
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <Skeleton className="h-64 md:h-72" />
                  <div className="p-8 space-y-4">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-10 w-40" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <Skeleton className="h-8 w-64" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-white shadow-md rounded-lg overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <div className="p-6 space-y-3">
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-6 w-full" />
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Featured Article */}
        {!isLoading && filteredNews.length > 0 && (
          <motion.div 
            className="mb-16"
            variants={itemFadeIn}
          >
            <h2 className="font-montserrat font-bold text-2xl text-primary mb-6">Featured Article</h2>
            <motion.div 
              className="bg-white rounded-lg shadow-lg overflow-hidden"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="h-64 md:h-auto bg-gray-200 overflow-hidden">
                  <motion.img 
                    src={filteredNews[0].image} 
                    alt={filteredNews[0].title} 
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <div className="p-8">
                  <div className="flex items-center mb-2">
                    <Badge variant="secondary" className="bg-primary text-white mr-2">{filteredNews[0].category}</Badge>
                    <span className="text-gray-500 text-sm">{filteredNews[0].date}</span>
                  </div>
                  <h3 className="font-montserrat font-bold text-2xl text-primary mb-3">
                    {filteredNews[0].title}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {filteredNews[0].excerpt}
                  </p>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      className="bg-secondary hover:bg-secondary/90 text-primary font-bold"
                      asChild
                    >
                      <a href={filteredNews[0].url} target="_blank" rel="noopener noreferrer">
                        Read Full Article
                      </a>
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
        
        {/* All Articles */}
        {!isLoading && (
          <motion.div variants={itemFadeIn}>
            <h2 className="font-montserrat font-bold text-2xl text-primary mb-6">Latest Articles</h2>
            
            {filteredNews.length === 0 ? (
              <motion.div 
                className="text-center py-12 bg-gray-100 rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-xl font-montserrat text-primary mb-2">No articles found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredNews.slice(1).map((article, index) => (
                  <motion.div 
                    key={article.id}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    custom={index}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="overflow-hidden h-full flex flex-col">
                      <div className="h-48 bg-gray-200 relative overflow-hidden">
                        <motion.img 
                          src={article.image} 
                          alt={article.title} 
                          className="w-full h-full object-cover"
                          variants={imageHover}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>
                      <CardContent className="p-6 flex flex-col flex-grow">
                        <div className="flex items-center mb-2">
                          <Badge variant="secondary" className="bg-primary text-white mr-2">{article.category}</Badge>
                          <span className="text-gray-500 text-sm">{article.date}</span>
                        </div>
                        <h3 className="font-montserrat font-bold text-xl text-primary mb-2">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 mb-4 flex-grow">
                          {article.excerpt.length > 120 
                            ? `${article.excerpt.substring(0, 120)}...` 
                            : article.excerpt}
                        </p>
                        <a href={article.url} className="text-secondary font-bold hover:underline flex items-center mt-auto group" target="_blank" rel="noopener noreferrer">
                          Read More 
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </a>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
            
            {filteredNews.length > 6 && (
              <motion.div 
                className="mt-12 text-center"
                variants={itemFadeIn}
              >
                <Button 
                  variant="outline" 
                  className="mr-2"
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                  <Button 
                    key={pageNum}
                    variant="outline" 
                    className={cn(
                      "mr-2", 
                      { "bg-primary text-white": pageNum === page }
                    )}
                    onClick={() => setPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                ))}
                <Button 
                  variant="outline"
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}
        
        {/* Newsletter Subscription */}
        <motion.div 
          className="mt-16 bg-primary text-white rounded-lg p-10"
          variants={itemFadeIn}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-8 md:w-2/3">
              <h3 className="font-montserrat font-bold text-2xl mb-3">Stay Updated</h3>
              <p className="text-white/90">
                Subscribe to our newsletter to receive the latest financial news, market insights, and investment opportunities directly in your inbox.
              </p>
            </div>
            <div className="w-full md:w-1/3">
              <form className="flex">
                <Input 
                  type="email" 
                  placeholder="Your email address" 
                  className="rounded-r-none text-foreground" 
                  required
                />
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button type="submit" className="bg-secondary hover:bg-secondary/90 text-primary rounded-l-none">
                    Subscribe
                  </Button>
                </motion.div>
              </form>
              <p className="text-xs text-white/70 mt-2">
                By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
    </PageTransition>
  );
};

export default News;
