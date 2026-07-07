export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type ReportRow = {
  id: string;
  status: string;
  company_name: string;
  email: string;
  phone: string;
  target_country: string;
  product_description: string;
  report_json: Json | null;
  model_used: string | null;
  payment_provider: string | null;
  provider_payment_id: string | null;
  amount_krw: number | null;
  paid_at: string | null;
  generation_started_at: string | null;
  generation_completed_at: string | null;
  generation_error: string | null;
  bank_transfer_claimed_at: string | null;
  created_at: string;
};

type ReportInsert = {
  id?: string;
  status?: string;
  company_name: string;
  email: string;
  phone: string;
  target_country: string;
  product_description: string;
  report_json?: Json | null;
  model_used?: string | null;
  payment_provider?: string | null;
  provider_payment_id?: string | null;
  amount_krw?: number | null;
  paid_at?: string | null;
  generation_started_at?: string | null;
  generation_completed_at?: string | null;
  generation_error?: string | null;
  bank_transfer_claimed_at?: string | null;
  created_at?: string;
};

type ReportUpdate = Partial<ReportInsert>;

type InquiryRow = {
  id: string;
  report_id: string | null;
  email: string;
  phone: string | null;
  message: string;
  created_at: string;
};

type InquiryInsert = {
  id?: string;
  report_id?: string | null;
  email: string;
  phone?: string | null;
  message: string;
  created_at?: string;
};

type InquiryUpdate = Partial<InquiryInsert>;

export type Database = {
  public: {
    Tables: {
      reports: {
        Row: ReportRow;
        Insert: ReportInsert;
        Update: ReportUpdate;
        Relationships: [];
      };
      inquiries: {
        Row: InquiryRow;
        Insert: InquiryInsert;
        Update: InquiryUpdate;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};
