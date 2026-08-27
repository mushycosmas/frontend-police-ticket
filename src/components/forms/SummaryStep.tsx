import React, { useEffect, useState } from "react";
import { AttachmentsStep } from "./AttachmentsStep";

import {
  getRegions,
  getDistricts,
} from "../../services/locationsApi";

interface Location {
  id: number | string;
  name: string;
}

interface SummaryStepProps {
  form: {
    customer_name: string;
    customer_phone: string;
    customer_nida?: string;
    customer_gender?: string;
    street_id: string;
    title: string;
    description: string;

    // Add channel
    channel?: string | number;
  };

  citizenData: any;

  files: FileList | null;

  setFiles: React.Dispatch<
    React.SetStateAction<FileList | null>
  >;
}

const getGenderText = (genderCode: string) => {
  switch (genderCode) {
    case "M":
      return "Male";

    case "F":
      return "Female";

    default:
      return genderCode || "Not specified";
  }
};

export const SummaryStep: React.FC<SummaryStepProps> = ({
  form,
  citizenData,
  files,
  setFiles,
}) => {
  const [regions, setRegions] = useState<Location[]>([]);
  const [districts, setDistricts] = useState<Location[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLocations = async () => {
      try {
        const [regionsResponse, districtsResponse] =
          await Promise.all([
            getRegions(),
            getDistricts(),
          ]);

        console.log(
          "REGIONS RESPONSE:",
          regionsResponse.data
        );

        console.log(
          "DISTRICTS RESPONSE:",
          districtsResponse.data
        );

        // Handle both paginated and normal arrays
        const regionsData = Array.isArray(
          regionsResponse.data
        )
          ? regionsResponse.data
          : regionsResponse.data?.results || [];

        const districtsData = Array.isArray(
          districtsResponse.data
        )
          ? districtsResponse.data
          : districtsResponse.data?.results || [];

        setRegions(regionsData);
        setDistricts(districtsData);

      } catch (error) {
        console.error(
          "ERROR LOADING LOCATIONS:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadLocations();
  }, []);

  // DEBUG
  console.log("CITIZEN DATA:", citizenData);
  console.log("REGIONS:", regions);
  console.log("DISTRICTS:", districts);

  // ================================
  // FIND REGION
  // ================================

  const selectedRegion = regions.find(
    (region) =>
      Number(region.id) ===
      Number(citizenData?.RESIDENTREGION)
  );

  // ================================
  // FIND DISTRICT
  // ================================

  const selectedDistrict = districts.find(
    (district) =>
      Number(district.id) ===
      Number(citizenData?.RESIDENTDISTRICT)
  );

  return (
    <>
      <div className="bg-gray-50 rounded-lg p-6 space-y-4">

        <h3 className="text-lg font-semibold text-gray-800">
          Review Your Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* FULL NAME */}
          <div>
            <p className="text-sm text-gray-500">
              Full Name
            </p>

            <p className="font-medium">
              {form.customer_name || "—"}
            </p>
          </div>

          {/* PHONE */}
          <div>
            <p className="text-sm text-gray-500">
              Phone
            </p>

            <p className="font-medium">
              {form.customer_phone || "—"}
            </p>
          </div>

          {/* NIDA NUMBER */}
          <div>
            <p className="text-sm text-gray-500">
              NIDA Number
            </p>

            <p className="font-medium">
              {form.customer_nida || "—"}
            </p>
          </div>

          {/* GENDER */}
          <div>
            <p className="text-sm text-gray-500">
              Gender
            </p>

            <p className="font-medium">
              {getGenderText(
                form.customer_gender || ""
              )}
            </p>
          </div>

          {/* REGION */}
          <div>
            <p className="text-sm text-gray-500">
              Region
            </p>

            <p className="font-medium">
              {loading
                ? "Loading..."
                : selectedRegion?.name ||
                  citizenData?.RESIDENTREGION ||
                  "—"}
            </p>
          </div>

          {/* DISTRICT */}
          <div>
            <p className="text-sm text-gray-500">
              District
            </p>

            <p className="font-medium">
              {loading
                ? "Loading..."
                : selectedDistrict?.name ||
                  citizenData?.RESIDENTDISTRICT ||
                  "—"}
            </p>
          </div>

          {/* CHANNEL */}
          <div>
            <p className="text-sm text-gray-500">
              Channel
            </p>

            <p className="font-medium">
              {form.channel || "—"}
            </p>
          </div>

          {/* ISSUE TITLE */}
          <div className="md:col-span-2">
            <p className="text-sm text-gray-500">
              Issue Title
            </p>

            <p className="font-medium">
              {form.title || "—"}
            </p>
          </div>

          {/* DESCRIPTION */}
          <div className="md:col-span-2">
            <p className="text-sm text-gray-500">
              Description
            </p>

            <p className="font-medium whitespace-pre-wrap">
              {form.description || "—"}
            </p>
          </div>

        </div>
      </div>

      <AttachmentsStep
        files={files}
        onFilesChange={setFiles}
      />
    </>
  );
};