import React, { useState, useMemo } from 'react';
import { ReviewData } from '../types';
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Filter, 
  ListFilter 
} from 'lucide-react';
import { clsx } from 'clsx';

interface ReviewExplorerProps {
  reviews: ReviewData[];
}

type SortField = 'date' | 'confidenceScore' | 'sentiment';
type SortOrder = 'asc' | 'desc';

export const ReviewExplorer: React.FC<ReviewExplorerProps> = ({ reviews }) => {
  const [searchText, setSearchText] = useState('');
  const [selectedSentiment, setSelectedSentiment] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Extract unique categories from data for the filter dropdown
  const categoriesList = useMemo(() => {
    const cats = new Set<string>();
    reviews.forEach(r => {
      if (r.category) cats.add(r.category);
    });
    return Array.from(cats).sort();
  }, [reviews]);

  // Handle Sort Toggle
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc'); // default to descending for new field
    }
    setCurrentPage(1);
  };

  // Filter & Search Logic
  const filteredReviews = useMemo(() => {
    return reviews
      .filter(item => {
        // Search text check
        const matchSearch = 
          item.reviewText.toLowerCase().includes(searchText.toLowerCase()) ||
          (item.productName && item.productName.toLowerCase().includes(searchText.toLowerCase()));
        
        // Sentiment filter
        const matchSentiment = 
          selectedSentiment === 'ALL' || 
          item.sentiment.toUpperCase() === selectedSentiment.toUpperCase();
        
        // Category filter
        const matchCategory = 
          selectedCategory === 'ALL' || 
          item.category.toUpperCase() === selectedCategory.toUpperCase();

        return matchSearch && matchSentiment && matchCategory;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];

        // Sort by sentiment ranking: Positive = 3, Neutral = 2, Negative = 1
        if (sortField === 'sentiment') {
          const rank = { 'Positive': 3, 'Neutral': 2, 'Negative': 1 };
          valA = rank[a.sentiment as 'Positive' | 'Neutral' | 'Negative'] || 0;
          valB = rank[b.sentiment as 'Positive' | 'Neutral' | 'Negative'] || 0;
        }

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [reviews, searchText, selectedSentiment, selectedCategory, sortField, sortOrder]);

  // Reset pagination when filter changes
  const totalItems = filteredReviews.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  
  const paginatedReviews = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredReviews.slice(startIndex, startIndex + pageSize);
  }, [filteredReviews, currentPage, pageSize]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Reset filters
  const resetFilters = () => {
    setSearchText('');
    setSelectedSentiment('ALL');
    setSelectedCategory('ALL');
    setCurrentPage(1);
  };

  // Render sort icon helper
  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="w-3.5 h-3.5 ml-1.5 opacity-40 group-hover:opacity-100 transition-opacity" />;
    return sortOrder === 'asc' 
      ? <ArrowUp className="w-3.5 h-3.5 ml-1.5 text-primary" /> 
      : <ArrowDown className="w-3.5 h-3.5 ml-1.5 text-primary" />;
  };

  // Category Badge Color classes map
  const getCategoryBadgeClass = (cat: string) => {
    switch (cat) {
      case 'Battery':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Connectivity':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Audio':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Display':
        return 'bg-pink-50 text-pink-700 border-pink-200';
      case 'Delivery':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="glass rounded-3xl border border-white/40 shadow-premium overflow-hidden flex flex-col w-full">
      {/* Table Header / Filters Area */}
      <div className="p-6 border-b border-slate-100 bg-white/40 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-display">Review Explorer</h2>
          <p className="text-xs text-slate-500 mt-1">Browse, search, sort, and inspect customer feedbacks in real-time.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative min-w-[200px] sm:min-w-[260px] flex-1 sm:flex-initial">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 pr-4 py-2 w-full text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-transparent transition-all bg-white/90"
            />
          </div>

          {/* Sentiment Filter */}
          <div className="relative">
            <select
              value={selectedSentiment}
              onChange={(e) => {
                setSelectedSentiment(e.target.value);
                setCurrentPage(1);
              }}
              className="appearance-none pl-9 pr-8 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-300 bg-white/90 cursor-pointer font-medium text-slate-700"
            >
              <option value="ALL">All Sentiments</option>
              <option value="POSITIVE">Positive</option>
              <option value="NEUTRAL">Neutral</option>
              <option value="NEGATIVE">Negative</option>
            </select>
            <ListFilter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              ▼
            </div>
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="appearance-none pl-9 pr-8 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-300 bg-white/90 cursor-pointer font-medium text-slate-700"
            >
              <option value="ALL">All Categories</option>
              {categoriesList.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              ▼
            </div>
          </div>

          {/* Clear Filters button */}
          {(searchText !== '' || selectedSentiment !== 'ALL' || selectedCategory !== 'ALL') && (
            <button
              onClick={resetFilters}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors py-2 px-3 rounded-lg hover:bg-indigo-50/50"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-500 text-xs font-semibold uppercase tracking-wider">
              <th className="px-6 py-4 w-[40%] min-w-[280px]">Review Feedbacks</th>
              <th 
                className="px-6 py-4 cursor-pointer hover:bg-slate-100/50 transition-colors w-[15%] group"
                onClick={() => handleSort('sentiment')}
              >
                <div className="flex items-center">
                  Sentiment
                  {renderSortIcon('sentiment')}
                </div>
              </th>
              <th className="px-6 py-4 w-[15%]">Category</th>
              <th 
                className="px-6 py-4 cursor-pointer hover:bg-slate-100/50 transition-colors w-[15%] group"
                onClick={() => handleSort('confidenceScore')}
              >
                <div className="flex items-center">
                  Confidence
                  {renderSortIcon('confidenceScore')}
                </div>
              </th>
              <th 
                className="px-6 py-4 cursor-pointer hover:bg-slate-100/50 transition-colors w-[15%] group"
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center">
                  Date
                  {renderSortIcon('date')}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {paginatedReviews.length > 0 ? (
              paginatedReviews.map((item) => (
                <tr 
                  key={item.id} 
                  className="hover:bg-slate-50/40 transition-colors group"
                >
                  <td className="px-6 py-4.5">
                    <div className="flex flex-col gap-1">
                      {item.productName && (
                        <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                          {item.productName}
                        </span>
                      )}
                      <p className="text-slate-800 font-medium leading-relaxed max-h-[72px] overflow-y-auto pr-1">
                        {item.reviewText}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4.5">
                    <span
                      className={clsx(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border shadow-sm",
                        item.sentiment === 'Positive' && "bg-emerald-50 text-emerald-700 border-emerald-200/50",
                        item.sentiment === 'Negative' && "bg-rose-50 text-rose-700 border-rose-200/50",
                        item.sentiment === 'Neutral' && "bg-slate-50 text-slate-600 border-slate-200/50"
                      )}
                    >
                      {item.sentiment}
                    </span>
                  </td>
                  <td className="px-6 py-4.5">
                    <span className={clsx(
                      "inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold border",
                      getCategoryBadgeClass(item.category)
                    )}>
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4.5">
                    <div className="flex flex-col gap-1.5 max-w-[80px]">
                      <span className="font-mono font-bold text-slate-800">
                        {Math.round(item.confidenceScore * 100)}%
                      </span>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className={clsx(
                            "h-full rounded-full",
                            item.confidenceScore > 0.85 ? "bg-emerald-500" : item.confidenceScore > 0.7 ? "bg-amber-500" : "bg-rose-500"
                          )}
                          style={{ width: `${item.confidenceScore * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4.5 text-slate-600 font-medium font-mono whitespace-nowrap">
                    {item.date}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <p className="text-sm font-semibold text-slate-600">No matching reviews found</p>
                    <p className="text-xs text-slate-400">Try modifying your query text or clearing the filters.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="p-4 border-t border-slate-100 bg-white/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs font-semibold text-slate-500">
        <div className="flex items-center gap-2">
          <span>Show</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border border-slate-200 rounded-lg p-1 text-slate-700 bg-white focus:outline-none"
          >
            <option value={5}>5 rows</option>
            <option value={10}>10 rows</option>
            <option value={25}>25 rows</option>
            <option value={50}>50 rows</option>
          </select>
          <span>of <span className="text-slate-800">{totalItems}</span> reviews</span>
        </div>

        {totalItems > 0 && (
          <div className="flex items-center justify-center gap-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white text-slate-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-slate-600">
              Page <span className="text-slate-800 font-bold">{currentPage}</span> of <span className="font-bold">{totalPages}</span>
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white text-slate-700 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
