type LeadRequest = {
  request_id: string;
  lead_provider_id: string;
  campaign_id: string;
  affiliate_id: string;
  requested_amount: number;
  ssn: string;
  email: string;
  state: string;
  custom_fields: {
    promo_code: string;
  };
};

type LeadResponse = {
  loanId: string;
  custimerId: string;
  lead_price: number;
  result: string;
  rejection_reason: string;
};

export interface LeadRequestReport {
  correlationId: string;
  leadResponse: LeadResponse;
  leadRequest: LeadRequest;
}
