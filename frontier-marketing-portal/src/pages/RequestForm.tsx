import { useParams } from "react-router-dom";

import MoodyCenterForm from "../request-forms/MoodyCenterForm";
import BusinessCardsForm from "../request-forms/BusinessCardsForm";
import MarketingMaterialsForm from "../request-forms/MarketingMaterialsForm";
import SponsorshipForm from "../request-forms/SponsorshipForm";
import AdvertisementForm from "../request-forms/AdvertisementForm";
import SocialMediaForm from "../request-forms/SocialMediaForm";
import EventItemsForm from "../request-forms/EventItemsForm";
import EmployeeSpotlightForm from "../request-forms/EmployeeSpotlightForm";
import CustomerSpotlightForm from "../request-forms/CustomerSpotlightForm";
import ApparelForm from "../request-forms/ApparelForm";

export default function RequestForm() {
  const { slug } = useParams();

  switch (slug) {
    
    case "moody-center":
      return <MoodyCenterForm />;

    case "business-cards":
      return <BusinessCardsForm />;

    case "marketing-materials":
      return <MarketingMaterialsForm />;

    case "sponsorship":
      return <SponsorshipForm />;

    case "advertisement":
      return <AdvertisementForm />;

      case "event-items":
  return <EventItemsForm />;

    case "social-media":
      return <SocialMediaForm />;

    case "employee-spotlight":
      return <EmployeeSpotlightForm />;

    case "customer-spotlight":
      return <CustomerSpotlightForm />;
      
      case "frontier-apparel":
  return <ApparelForm />;

    default:
      return (
        <div className="formCard">
          <h1>Form Not Found</h1>
          <p>
            This request type has not been
            configured yet.
          </p>
        </div>
      );
  }
}