-- Existing Launch List and website-support records retain their original consent.
-- New Launch List submissions require phone at the API; website-support requests
-- continue without it. The nullable column preserves historical records.
ALTER TABLE founding_consultation_requests
  ADD COLUMN phone TEXT CHECK (
    phone IS NULL OR (length(phone) = 12 AND substr(phone, 1, 2) = '+1')
  );
