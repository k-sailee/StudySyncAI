import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, User, GraduationCap, Users, Loader2, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { searchUsers, UserSearchResult } from "@/services/userService";
import { useAuth } from "@/context/AuthContext";

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  onUserSelect?: (user: UserSearchResult) => void;
}

export function SearchBar({ placeholder, className, onUserSelect }: SearchBarProps) {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [roleFilter, setRoleFilter] = useState<"all" | "teacher" | "student">("all");
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced search
  const debouncedSearch = useCallback(
    async (searchQuery: string) => {
      if (searchQuery.trim().length < 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const role = roleFilter === "all" ? undefined : roleFilter;
        const searchResults = await searchUsers(
          searchQuery,
          role,
          user?.uid,
          10
        );
        setResults(searchResults);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    },
    [roleFilter, user?.uid]
  );

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) {
        debouncedSearch(query);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, debouncedSearch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleUserClick = (selectedUser: UserSearchResult) => {
    onUserSelect?.(selectedUser);
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    inputRef.current?.focus();
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const defaultPlaceholder = user?.role === "teacher" 
    ? "Search students..." 
    : "Search teachers...";

  return (
    <div ref={searchRef} className={cn("relative", className)}>
      {/* Search Input */}
      <div className="relative flex items-center">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none z-10" />
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder || defaultPlaceholder}
          className="pl-10 pr-20 w-64 lg:w-80 bg-accent/50 border-transparent focus:border-primary"
        />
        
        {/* Role Filter Pills */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {query && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={clearSearch}
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Results Dropdown */}
      <AnimatePresence>
        {isOpen && (query.length >= 2 || results.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50"
          >
            {/* Filter Tabs */}
            <div className="flex items-center gap-1 p-2 border-b border-border bg-accent/30">
              <Button
                size="sm"
                variant={roleFilter === "all" ? "default" : "ghost"}
                className="h-7 text-xs"
                onClick={() => setRoleFilter("all")}
              >
                All
              </Button>
              <Button
                size="sm"
                variant={roleFilter === "teacher" ? "default" : "ghost"}
                className="h-7 text-xs gap-1"
                onClick={() => setRoleFilter("teacher")}
              >
                <Users className="w-3 h-3" />
                Teachers
              </Button>
              <Button
                size="sm"
                variant={roleFilter === "student" ? "default" : "ghost"}
                className="h-7 text-xs gap-1"
                onClick={() => setRoleFilter("student")}
              >
                <GraduationCap className="w-3 h-3" />
                Students
              </Button>
            </div>

            {/* Results List */}
            <div className="max-h-80 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-sm text-muted-foreground">Searching...</span>
                </div>
              ) : results.length > 0 ? (
                <ul className="py-1">
                  {results.map((result) => (
                    <li key={result.uid}>
                      <button
                        onClick={() => handleUserClick(result)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors text-left"
                      >
                        <Avatar className="w-10 h-10 border-2 border-primary/20">
                          <AvatarImage src={result.profileImage || undefined} />
                          <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white text-sm">
                            {getInitials(result.displayName || "U")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm truncate">
                              {result.displayName}
                            </p>
                            <Badge
                              variant={result.role === "teacher" ? "default" : "secondary"}
                              className="text-xs capitalize"
                            >
                              {result.role === "teacher" ? (
                                <Users className="w-3 h-3 mr-1" />
                              ) : (
                                <GraduationCap className="w-3 h-3 mr-1" />
                              )}
                              {result.role}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {result.email}
                          </p>
                          {result.subject && result.subject.length > 0 && (
                            <div className="flex items-center gap-1 mt-1">
                              <BookOpen className="w-3 h-3 text-muted-foreground" />
                              <p className="text-xs text-muted-foreground">
                                {result.subject.slice(0, 2).join(", ")}
                                {result.subject.length > 2 && ` +${result.subject.length - 2}`}
                              </p>
                            </div>
                          )}
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : query.length >= 2 ? (
                <div className="py-8 text-center">
                  <User className="w-10 h-10 mx-auto text-muted-foreground/50 mb-2" />
                  <p className="text-sm text-muted-foreground">No users found</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Try a different search term
                  </p>
                </div>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
