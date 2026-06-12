export interface InstructorService {
  id: string;
  title: string;
  description: string | null;
  price: number | null;
  duration_minutes: number | null;
  is_active: boolean;
}

export interface ServiceFormData {
  title: string;
  description: string;
  price: string;
  duration_minutes: string;
  is_active: boolean;
}

export const emptyServiceForm: ServiceFormData = {
  title: "",
  description: "",
  price: "",
  duration_minutes: "",
  is_active: true,
};

export const serviceToForm = (s: InstructorService): ServiceFormData => ({
  title: s.title,
  description: s.description || "",
  price: s.price?.toString() || "",
  duration_minutes: s.duration_minutes?.toString() || "",
  is_active: s.is_active,
});

export const formatDuration = (minutes: number | null) => {
  if (!minutes) return null;
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return remaining > 0 ? `${hours}h ${remaining}min` : `${hours}h`;
};
