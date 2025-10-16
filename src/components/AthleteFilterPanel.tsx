import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";
import { AthleteFilters } from "@/integrations/supabase/modules/athleteFilters";

interface AthleteFilterPanelProps {
  filters: AthleteFilters;
  onFilterChange: (filters: AthleteFilters) => void;
  onClearFilters: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

const AthleteFilterPanel: React.FC<AthleteFilterPanelProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
  isOpen,
  onToggle,
}) => {
  const hasActiveFilters = Object.entries(filters).some(([key, value]) => 
    key !== 'searchQuery' && value !== undefined && value !== ''
  );

  return (
    <div className="border-b border-border bg-background">
      <div className="container px-4 py-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onToggle}
          className="w-full justify-between"
        >
          <span className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Advanced Filters {hasActiveFilters && `(${Object.values(filters).filter(v => v).length - (filters.searchQuery ? 1 : 0)})`}
          </span>
          {hasActiveFilters && (
            <X 
              className="h-4 w-4" 
              onClick={(e) => {
                e.stopPropagation();
                onClearFilters();
              }}
            />
          )}
        </Button>
      </div>

      {isOpen && (
        <div className="container px-4 pb-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Gender */}
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={filters.gender || ""}
                onValueChange={(value) => onFilterChange({ ...filters, gender: value || undefined })}
              >
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Age Range */}
            <div className="space-y-2">
              <Label>Age Range</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.minAge || ""}
                  onChange={(e) => onFilterChange({ ...filters, minAge: e.target.value ? parseInt(e.target.value) : undefined })}
                  min="0"
                  max="100"
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.maxAge || ""}
                  onChange={(e) => onFilterChange({ ...filters, maxAge: e.target.value ? parseInt(e.target.value) : undefined })}
                  min="0"
                  max="100"
                />
              </div>
            </div>

            {/* Position */}
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                placeholder="e.g., Forward, Midfielder"
                value={filters.position || ""}
                onChange={(e) => onFilterChange({ ...filters, position: e.target.value || undefined })}
              />
            </div>

            {/* Dominant Foot */}
            <div className="space-y-2">
              <Label htmlFor="dominantFoot">Dominant Foot</Label>
              <Select
                value={filters.dominantFoot || ""}
                onValueChange={(value) => onFilterChange({ ...filters, dominantFoot: value || undefined })}
              >
                <SelectTrigger id="dominantFoot">
                  <SelectValue placeholder="Select foot" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All</SelectItem>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Division */}
            <div className="space-y-2">
              <Label htmlFor="division">Division</Label>
              <Input
                id="division"
                placeholder="e.g., Division 1"
                value={filters.division || ""}
                onChange={(e) => onFilterChange({ ...filters, division: e.target.value || undefined })}
              />
            </div>

            {/* Years Played Range */}
            <div className="space-y-2">
              <Label>Years of Experience</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.minYearsPlayed || ""}
                  onChange={(e) => onFilterChange({ ...filters, minYearsPlayed: e.target.value ? parseInt(e.target.value) : undefined })}
                  min="0"
                  max="50"
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.maxYearsPlayed || ""}
                  onChange={(e) => onFilterChange({ ...filters, maxYearsPlayed: e.target.value ? parseInt(e.target.value) : undefined })}
                  min="0"
                  max="50"
                />
              </div>
            </div>

            {/* Height Range (cm) */}
            <div className="space-y-2">
              <Label>Height (cm)</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.minHeight || ""}
                  onChange={(e) => onFilterChange({ ...filters, minHeight: e.target.value ? parseInt(e.target.value) : undefined })}
                  min="0"
                  max="300"
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.maxHeight || ""}
                  onChange={(e) => onFilterChange({ ...filters, maxHeight: e.target.value ? parseInt(e.target.value) : undefined })}
                  min="0"
                  max="300"
                />
              </div>
            </div>

            {/* Weight Range (kg) */}
            <div className="space-y-2">
              <Label>Weight (kg)</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.minWeight || ""}
                  onChange={(e) => onFilterChange({ ...filters, minWeight: e.target.value ? parseInt(e.target.value) : undefined })}
                  min="0"
                  max="300"
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.maxWeight || ""}
                  onChange={(e) => onFilterChange({ ...filters, maxWeight: e.target.value ? parseInt(e.target.value) : undefined })}
                  min="0"
                  max="300"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={onClearFilters} 
              variant="outline"
              className="flex-1"
            >
              Clear All Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AthleteFilterPanel;
