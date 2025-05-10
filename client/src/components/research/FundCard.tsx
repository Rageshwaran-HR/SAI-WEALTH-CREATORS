import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, ExternalLink } from 'lucide-react';
import { Link } from 'wouter';

interface FundCardProps {
  fund: {
    symbol: string;
    name: string;
    exchange?: string;
    assetClass?: string;
    price?: number;
    changes?: number;
    changesPercentage?: number;
  };
}

export function FundCard({ fund }: FundCardProps) {
  const isTrendingUp = fund.changes && fund.changes >= 0;
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-semibold text-primary mb-1 line-clamp-2">{fund.name}</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Badge variant="outline" className="bg-gray-100">{fund.symbol}</Badge>
              {fund.exchange && <span>{fund.exchange}</span>}
              {fund.assetClass && <Badge>{fund.assetClass}</Badge>}
            </div>
          </div>
          {fund.changes !== undefined && (
            <div className={`flex items-center ${isTrendingUp ? 'text-success' : 'text-destructive'} font-medium`}>
              {isTrendingUp ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
              )}
              <span>{fund.changesPercentage?.toFixed(2)}%</span>
            </div>
          )}
        </div>
        
        {fund.price !== undefined && (
          <div className="mb-4">
            <div className="text-2xl font-bold text-primary">${fund.price.toFixed(2)}</div>
            {fund.changes !== undefined && (
              <div className={`text-sm ${isTrendingUp ? 'text-success' : 'text-destructive'}`}>
                {isTrendingUp ? '+' : ''}{fund.changes.toFixed(2)}
              </div>
            )}
          </div>
        )}
        
        <div className="flex justify-between mt-3">
          <Button 
            size="sm" 
            variant="outline" 
            className="text-sm"
            asChild
          >
            <Link href={`/research/fund/${fund.symbol}`}>
              View Details
            </Link>
          </Button>
          
          <a 
            href={`https://finance.yahoo.com/quote/${fund.symbol}`} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Button 
              size="sm" 
              variant="secondary" 
              className="text-sm text-primary"
            >
              <ExternalLink className="h-3.5 w-3.5 mr-1" /> Yahoo Finance
            </Button>
          </a>
        </div>
      </CardContent>
    </Card>
  );
}