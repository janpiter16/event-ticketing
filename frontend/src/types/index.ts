export interface Role {
  id: number;
  name: string;
  slug: 'super-admin' | 'organizer' | 'staff' | 'participant';
}

export interface OrganizerProfile {
  id: number;
  organization_name: string;
  organization_description?: string;
  website?: string;
  phone?: string;
  is_verified?: boolean;
}

export interface User {
  id: number;
  name: string;
  email: string;
  roles: Role[];
  organizer_profile?: OrganizerProfile;
}

export interface EventCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}

export interface TicketType {
  id: number;
  event_id: number;
  name: string;
  code?: string;
  description?: string;
  price: string | number;
  quota: number;
  min_purchase: number;
  max_purchase: number;
  is_active: boolean;
}

export interface EventItem {
  id: number;
  organizer_id: number;
  category_id?: number;
  name: string;
  slug: string;
  description: string;
  cover_image?: string;
  start_at: string;
  end_at: string;
  registration_open_at?: string;
  registration_close_at?: string;
  venue_name?: string;
  venue_address?: string;
  latitude?: number;
  longitude?: number;
  is_online: boolean;
  online_url?: string;
  terms_and_conditions?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED' | 'ARCHIVED';
  created_at?: string;
  updated_at?: string;
  organizer?: {
    id: number;
    name: string;
    email: string;
  };
  category?: EventCategory;
  ticket_types?: TicketType[];
  tickets_sold?: number;
}

export interface IssuedTicket {
  id: number;
  ticket_number: string;
  qr_token: string;
  event: {
    id: number;
    name: string;
    start_at: string;
    venue_name?: string;
    is_online: boolean;
  };
  ticket_type: {
    id: number;
    name: string;
    price: number | string;
  };
  participant_name: string;
  participant_email: string;
  status: 'ISSUED' | 'CHECKED_IN' | 'CANCELLED';
  checked_in_at?: string;
}
