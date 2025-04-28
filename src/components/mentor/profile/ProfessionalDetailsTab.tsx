
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ProfessionalDetailsTabProps {
  formData: {
    jobTitle: string;
    company: string;
    role: string;
    bio: string;
    pastSectors: string[];
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  toggleSector: (sector: string) => void;
  sectors: string[];
}

const ProfessionalDetailsTab: React.FC<ProfessionalDetailsTabProps> = ({
  formData,
  handleChange,
  toggleSector,
  sectors,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="jobTitle" className="text-sm font-medium">
            Current Job Title *
          </label>
          <Input
            id="jobTitle"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleChange}
            required
            placeholder="e.g. Senior Software Engineer"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="company" className="text-sm font-medium">
            Current Company *
          </label>
          <Input
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            required
            placeholder="e.g. Google"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label htmlFor="role" className="text-sm font-medium">
            Mentoring Role
          </label>
          <Input
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            placeholder="e.g. Technical Mentor, Career Coach"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="bio" className="text-sm font-medium">
          Professional Bio *
        </label>
        <Textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          required
          placeholder="Tell students about your experience, expertise, and mentoring style"
          className="h-32"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium block mb-2">
          Past Industry Sectors
        </label>
        <div className="flex flex-wrap gap-2">
          {sectors.map((sector) => (
            <button
              key={sector}
              type="button"
              onClick={() => toggleSector(sector)}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                formData.pastSectors.includes(sector)
                  ? "bg-mentor text-white"
                  : "bg-secondary text-primary hover:bg-secondary/80"
              }`}
            >
              {sector}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalDetailsTab;
