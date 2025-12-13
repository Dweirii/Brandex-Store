"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Container from "@/components/ui/container";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  Loader2,
  Trophy,
  Medal,
  Award,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";

interface UserData {
  username: string | null;
  imageUrl: string | null;
  firstName: string | null;
  lastName: string | null;
  displayName: string | null;
}

interface LeaderboardEntry {
  rank: number;
  userId: string;
  totalDownloads: number;
  user: UserData | null;
}

interface LeaderboardResponse {
  data: LeaderboardEntry[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalUsers: number;
    limit: number;
  };
}

export default function LeaderboardPage() {
  const { user } = useUser();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    limit: 20,
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [storeId, setStoreId] = useState<string>("");

  useEffect(() => {
    // Get storeId from environment variable
    const defaultStoreId = process.env.NEXT_PUBLIC_DEFAULT_STORE_ID || "";
    setStoreId(defaultStoreId);
  }, []);

  const fetchLeaderboard = useCallback(async (page: number) => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/118951c9-c7dc-4544-86a8-013be18c57df',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'leaderboard/page.tsx:68',message:'fetchLeaderboard entry',data:{page,storeId:storeId||'missing'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    if (!storeId) {
      setIsLoading(false);
      setError("Store ID is not configured. Please check your environment variables.");
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/118951c9-c7dc-4544-86a8-013be18c57df',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'leaderboard/page.tsx:75',message:'storeId missing',data:{storeId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      return;
    }

    if (!apiUrl) {
      setIsLoading(false);
      setError("API URL is not configured. Please check your environment variables.");
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/118951c9-c7dc-4544-86a8-013be18c57df',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'leaderboard/page.tsx:81',message:'apiUrl missing',data:{apiUrl},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Construct the API URL
      // The admin API route is at /api/[storeId]/leaderboard
      // NEXT_PUBLIC_API_URL might be:
      // 1. Full path with storeId: "https://admin.com/api/[storeId]" -> use "/leaderboard"
      // 2. Base API path: "https://admin.com/api" -> use "/[storeId]/leaderboard"
      // 3. Base domain: "https://admin.com" -> use "/api/[storeId]/leaderboard"
      
      let fullApiUrl: string;
      const cleanApiUrl = apiUrl.replace(/\/$/, ''); // Remove trailing slash
      
      if (cleanApiUrl.includes(`/${storeId}`)) {
        // API URL already includes storeId path
        fullApiUrl = `${cleanApiUrl}/leaderboard`;
      } else if (cleanApiUrl.endsWith('/api')) {
        // API URL ends with /api, need to add storeId
        fullApiUrl = `${cleanApiUrl}/${storeId}/leaderboard`;
      } else {
        // Base domain, need to add /api/[storeId]
        fullApiUrl = `${cleanApiUrl}/api/${storeId}/leaderboard`;
      }

      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/118951c9-c7dc-4544-86a8-013be18c57df',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'leaderboard/page.tsx:106',message:'URL constructed',data:{originalApiUrl:apiUrl,cleanApiUrl,fullApiUrl,storeId,page},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion

      // Log in development for debugging
      if (process.env.NODE_ENV === "development") {
        console.log("Leaderboard API Debug:", {
          originalApiUrl: apiUrl,
          storeId,
          constructedUrl: fullApiUrl,
          page,
        });
      }

      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/118951c9-c7dc-4544-86a8-013be18c57df',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'leaderboard/page.tsx:118',message:'axios.get starting',data:{url:fullApiUrl,params:{page,limit:20}},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion

      const response = await axios.get<LeaderboardResponse>(
        fullApiUrl,
        {
          params: {
            page,
            limit: 20,
          },
          maxRedirects: 5,
          timeout: 10000, // 10 second timeout
          withCredentials: false, // Don't send credentials for CORS
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/118951c9-c7dc-4544-86a8-013be18c57df',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'leaderboard/page.tsx:131',message:'axios response received',data:{status:response.status,statusText:response.statusText,hasData:!!response.data},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion

      // Check if response is successful
      if (response.status >= 200 && response.status < 300) {
        setLeaderboard(response.data.data);
        setPagination(response.data.pagination);
        setCurrentPage(page);
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/118951c9-c7dc-4544-86a8-013be18c57df',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'leaderboard/page.tsx:135',message:'success - data set',data:{entryCount:response.data.data.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
        // #endregion
      } else {
        throw new Error(`Unexpected status code: ${response.status}`);
      }
    } catch {
      console.error("Error fetching leaderboard:");
    } finally {
      setIsLoading(false);
    }
  }, [storeId]);

  useEffect(() => {
    if (storeId) {
      fetchLeaderboard(1);
    }
  }, [storeId, fetchLeaderboard]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchLeaderboard(newPage);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-8 w-8 text-yellow-500" />;
      case 2:
        return <Medal className="h-8 w-8 text-gray-400" />;
      case 3:
        return <Award className="h-8 w-8 text-amber-600" />;
      default:
        return (
          <div className="h-8 w-8 flex items-center justify-center font-bold text-muted-foreground">
            {rank}
          </div>
        );
    }
  };
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600";
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-500";
      case 3:
        return "bg-gradient-to-r from-amber-500 to-amber-700";
      default:
        return "bg-muted";
    }
  };

  return (
    <Container>
      <div className="py-8 md:py-12 lg:py-16">
        <div className="text-center mb-12">
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-foreground mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Download Leaderboard 🏆
          </motion.h1>
          <motion.p
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            See who&apos;s downloading the most! Compete with other users and climb the ranks.
          </motion.p>
        </div>

        {/* Stats */}
        {!isLoading && !error && leaderboard.length > 0 && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <Trophy className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">
                {pagination.totalUsers}
              </p>
              <p className="text-sm text-muted-foreground">Total Users</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <Download className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">
                {leaderboard[0]?.totalDownloads || 0}
              </p>
              <p className="text-sm text-muted-foreground">Top Downloads</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <Award className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">
                {currentPage} / {pagination.totalPages}
              </p>
              <p className="text-sm text-muted-foreground">Current Page</p>
            </div>
          </motion.div>
        )}

        {/* Render States */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center py-16 text-muted-foreground bg-card rounded-2xl shadow-lg border border-border"
            >
              <Loader2 className="h-12 w-12 animate-spin mb-6 text-primary" />
              <p className="text-xl font-semibold mb-2">
                Loading leaderboard...
              </p>
              <p className="text-sm">
                Please wait while we fetch the rankings.
              </p>
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <Alert variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20">
                <AlertCircle className="h-5 w-5" />
                <AlertTitle className="text-lg font-semibold">
                  Error Loading Leaderboard
                </AlertTitle>
                <AlertDescription className="text-base">{error}</AlertDescription>
              </Alert>
              <div className="flex justify-center">
                <Button
                  onClick={() => fetchLeaderboard(currentPage)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Loader2 className="h-4 w-4" />
                  Try Again
                </Button>
              </div>
            </motion.div>
          ) : leaderboard.length === 0 ? (
            <motion.div
              key="no-data"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center py-20 text-muted-foreground bg-card rounded-2xl shadow-lg border border-border"
            >
              <Trophy className="h-20 w-20 text-muted-foreground/50 mb-6" />
              <p className="text-3xl font-bold mb-4 text-foreground">
                No Data Yet!
              </p>
              <p className="text-lg text-center max-w-md">
                Be the first to download and appear on the leaderboard!
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="leaderboard-list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* Leaderboard List */}
              <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg">
                {leaderboard.map((entry, index) => {
                  const isCurrentUser = user?.id === entry.userId;
                  return (
                    <motion.div
                      key={entry.userId}
                      className={cn(
                        "flex items-center gap-4 p-4 md:p-6 border-b border-border last:border-b-0",
                        isCurrentUser && "bg-primary/5 border-l-4 border-l-primary",
                        entry.rank <= 3 && "bg-muted/20"
                      )}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      {/* Rank */}
                      <div className="flex-shrink-0 w-16 flex justify-center">
                        {getRankIcon(entry.rank)}
                      </div>

                      {/* User Info */}
                      <div className="flex-1 min-w-0 flex items-center gap-3">
                        {/* Avatar */}
                        <Avatar className="h-10 w-10 flex-shrink-0">
                          <AvatarImage 
                            src={entry.user?.imageUrl || undefined} 
                            alt={entry.user?.displayName || entry.user?.username || entry.user?.firstName || "User"}
                          />
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {entry.user?.displayName 
                              ? entry.user.displayName.charAt(0).toUpperCase()
                              : entry.user?.firstName
                              ? entry.user.firstName.charAt(0).toUpperCase()
                              : entry.user?.username
                              ? entry.user.username.charAt(0).toUpperCase()
                              : entry.userId.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        
                        {/* Name and Rank */}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-foreground truncate flex items-center gap-2">
                            {isCurrentUser ? (
                              <>
                                {entry.user?.displayName || entry.user?.firstName || entry.user?.username || "You"}
                                <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                                  ME
                                </span>
                              </>
                            ) : (
                              entry.user?.displayName || 
                              entry.user?.firstName || 
                              entry.user?.username ||
                              `User ${entry.userId.substring(0, 8)}...`
                            )}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Rank #{entry.rank}
                            {entry.user?.username && !entry.user?.displayName && (
                              <span className="ml-2">@{entry.user.username}</span>
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Downloads */}
                      <div className="flex-shrink-0 text-right">
                        <div className="flex items-center gap-2">
                          <Download className="h-5 w-5 text-primary" />
                          <p className="text-xl md:text-2xl font-bold text-foreground">
                            {entry.totalDownloads}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground">downloads</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>

                  <div className="flex items-center gap-2">
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      let pageNum: number;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(pageNum)}
                          className="w-10"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === pagination.totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Container>
  );
}