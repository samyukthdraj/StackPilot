"use client";

import { Job } from "@/lib/types/api";
import { useMemo } from "react";

interface JobStructuredDataProps {
  job: Job;
}

export function JobStructuredData({ job }: JobStructuredDataProps) {
  const structuredData = useMemo(() => {
    const postedDate = job.postedAt ? new Date(job.postedAt) : new Date();
    const expiryDate = new Date(postedDate.getTime() + 60 * 24 * 60 * 60 * 1000);

    return {
      "@context": "https://schema.org/",
      "@type": "JobPosting",
      "title": job.title,
      "description": job.description,
      "datePosted": job.postedAt,
      "validThrough": expiryDate.toISOString(),
      "employmentType": job.jobType?.toUpperCase().replace("_", "-") || "FULL-TIME",
      "hiringOrganization": {
        "@type": "Organization",
        "name": job.company,
        "logo": "https://stackpilot-jext.onrender.com/images/favicon.svg"
      },
      "jobLocation": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": job.location || "Remote",
          "addressCountry": job.country || "Global"
        }
      },
      "baseSalary": job.salaryMin ? {
        "@type": "MonetaryAmount",
        "currency": "USD",
        "value": {
          "@type": "QuantitativeValue",
          "minValue": job.salaryMin,
          "maxValue": job.salaryMax,
          "unitText": "YEAR"
        }
      } : undefined
    };
  }, [job]);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
