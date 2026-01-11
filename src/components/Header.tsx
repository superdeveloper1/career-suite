import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Search, Heart, User, Menu, ArrowLeft } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useUser } from '@/types/UserContext';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  showSearch?: boolean;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  suggestions?: string[];
  isAdmin?: boolean;
}

const Header = ({ showSearch = false, searchQuery = '', onSearchChange, suggestions = [], isAdmin }: HeaderProps) => {
  const { state: cartState } = useCart();
  const { user, logout } = useUser();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const filteredSuggestions = searchQuery
    ? suggestions.filter(item =>
      item.toLowerCase().includes(searchQuery.toLowerCase()) &&
      item.toLowerCase() !== searchQuery.toLowerCase()
    ).slice(0, 5)
    : [];

  // Check localStorage if isAdmin prop is not provided (for pages other than Index)
  const [isLocalAdmin] = useState(() => sessionStorage.getItem('isAdminAuthenticated') === 'true');

  const showAdminLink = isAdmin !== undefined ? isAdmin : isLocalAdmin;

  const handleLogout = () => {
    logout();
    sessionStorage.removeItem('isAdminAuthenticated');
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
      variant: "destructive" // changed to destructive as per usual pattern for logout, or keep default
    });
    window.location.href = '/'; // Force refresh to update UI state
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>

          {/* Go Back Icon - Only show if not on home page */}
          {location.pathname !== '/' && (
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="mr-2 hidden md:flex" aria-label="Go Back">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}

          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
              <ShoppingCart className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl">EliteStore</span>
          </Link>
        </div>

        {/* Search Bar */}
        {showSearch && (
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange?.(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="pl-10"
              />
              {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="absolute top-full left-0 w-full bg-background border rounded-md shadow-lg mt-1 z-50 overflow-hidden">
                  {filteredSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-muted cursor-pointer text-sm"
                      onClick={() => {
                        onSearchChange?.(suggestion);
                        setShowSuggestions(false);
                      }}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center space-x-4">
          <Link to="/profile">
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
            </Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user ? `Hi, ${user.name}` : 'My Account'}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {user && (
                <>
                  <DropdownMenuItem onClick={() => navigate('/profile')}>Profile</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/profile')}>Orders</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/profile')}>Your Saves</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/track-order')}>Track Order</DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator />
              {!user && (
                <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/login')}>
                  Sign In
                </DropdownMenuItem>
              )}
              {!user && (
                <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/register')}>
                  Create Account
                </DropdownMenuItem>
              )}
              {showAdminLink && (
                <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/#admin')}>
                  Admin Dashboard
                </DropdownMenuItem>
              )}
              {user && (
                <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600" onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartState.itemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {cartState.itemCount}
                </Badge>
              )}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;