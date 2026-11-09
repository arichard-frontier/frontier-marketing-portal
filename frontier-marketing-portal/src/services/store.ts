import type { MarketingRequest,Status } from '../types';

const KEY='frontier-marketing-requests';

const seed:MarketingRequest[]=[
 {id:'1',requestNumber:'MKT-2026-0001',typeSlug:'marketing-materials',typeTitle:'Marketing Material',workflow:'standard',requesterName:'Jordan Lee',requesterEmail:'jordan@example.com',branchDepartment:'Round Rock',dueDate:'2026-10-08',submittedAt:'2026-09-28T14:00:00Z',status:'Submitted',assignedTo:'',details:{materialType:'Flyer',campaign:'Small Business Event'},
 submitterNote:'',privateNote:''},
  {id:'2',requestNumber:'MKT-2026-0002',typeSlug:'moody-center',typeTitle:'Moody Center Request',workflow:'moody',requesterName:'Taylor Smith',requesterEmail:'taylor@example.com',branchDepartment:'Austin',dueDate:'2026-10-15',submittedAt:'2026-09-28T15:00:00Z',status:'Submitted',assignedTo:'',details:{event:'Concert',tickets:'2',businessPurpose:'Customer appreciation'},submitterNote:'',privateNote:''}
];

export async function list(): Promise<MarketingRequest[]> {
  const response = await fetch(
  "/api/requests"
);

const data = await response.json();

if (!response.ok) {
  console.error(
    "REQUEST LIST FAILED:",
    data
  );

  throw new Error(
    data.error ||
      "Unable to load marketing requests."
  );
}

if (!Array.isArray(data.value)) {
  console.error(
    "INVALID REQUEST LIST RESPONSE:",
    data
  );

  throw new Error(
    "The request list returned an invalid response."
  );
}

 console.log(
  "ALL SHAREPOINT REQUESTS:",
  data.value
);

console.log(
  "LATEST SHAREPOINT REQUEST:",
  data.value?.[
    data.value.length - 1
  ]
);

  return (data.value || [])
    .map((item: any) => {
      let details: Record<string, any> = {};

      try {
        details =
          item.fields?.Description
            ? JSON.parse(
                item.fields.Description
              )
            : {};
      } catch {
        details = {};
      }

      return {
        id: String(item.id),

        requestNumber:
          `MKT-${new Date().getFullYear()}-${String(
            item.id
          ).padStart(4, "0")}`,

        typeSlug:
          details.typeSlug || "",

        typeTitle:
          item.fields?.RequestType ||
          "Other",

        workflow:
          details.workflow ||
          "standard",

        requesterName:
          item.fields?.SubmittedBy ||
          details.fullName ||
          "",

        requesterEmail:
          item.fields?.SubmittedEmail ||
          item.fields?.EmployeeEmail ||
          details.email ||
          "",

        branchDepartment:
          item.fields?.Branch ||
          details.branch ||
          "",

        dueDate:
  item.fields?.DateNeeded ||
  details.dateNeeded ||
  details.dueDate ||
  "",

        submittedAt:
  item.createdDateTime ||
  new Date().toISOString(),

updatedAt:
  item.lastModifiedDateTime ||
  item.createdDateTime ||
  new Date().toISOString(),

status:
  item.fields?.Status ||
  "Submitted",

        assignedTo:
          item.fields?.AssignedTo ||
          "",

        details,

       submitterNote:
  item.fields?.MarketingNotes ||
  "",

privateNote: "",

proofStatus:
  item.fields?.ProofStatus ||
  "No Proof",

proofFileName:
  item.fields?.ProofFileName ||
  "",

proofUrl:
  item.fields?.ProofURL ||
  (
    item.fields?.ProofFileName
      ? `https://frontierbankoftexas.sharepoint.com/Marketing%20Request%20Uploads/${
          item.fields?.RequestType ===
          "Marketing Materials"
            ? "Marketing%20Materials"
            : item.fields?.RequestType ===
              "Business Cards"
            ? "Business%20Cards"
            : "Advertisements"
        }/MKT-${new Date().getFullYear()}-${String(
          item.id
        ).padStart(4, "0")}/${encodeURIComponent(
          item.fields.ProofFileName
        )}?web=1`
      : ""
  ),


proofFeedback:
  item.fields?.ProofFeedback ||
  "",

proofVersion:
  Number(
    item.fields?.ProofVersion ||
    0
  ),

proofUploadedAt:
  item.fields?.ProofUploadedAt ||
  "",

proofReviewedAt:
  item.fields?.ProofReviewedAt ||
  "",
      };
    })
    .sort(
      (
        a: MarketingRequest,
        b: MarketingRequest
      ) =>
        new Date(
          b.submittedAt
        ).getTime() -
        new Date(
          a.submittedAt
        ).getTime()
    );
}

function save(items:MarketingRequest[]){
 localStorage.setItem(KEY,JSON.stringify(items));
 window.dispatchEvent(new Event('requests-changed'));
}

export async function create(
  input: Omit<
    MarketingRequest,
    "id" | "requestNumber" | "submittedAt" | "status"
  >
) {
  const response = await fetch("/api/requests", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const result = await response.json();

  console.log("API RESULT:", result);

  const requestNumber = `MKT-${new Date().getFullYear()}-${String(
    result.id || 0
  ).padStart(4, "0")}`;

  return {
    requestNumber,
    ...result,
  };
}


export async function updateStatus(
  id: string,
  status: Status,
  note: string
) {
  console.log(
    "UPDATING:",
    id,
    status,
    note
  );

  const response = await fetch(
    "/api/requests",
    {
      method: "PATCH",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        id,
        status,
        note,
      }),
    }
  );

  const result =
    await response.json();

  console.log(
    "PATCH RESULT:",
    result
  );

  window.dispatchEvent(
    new Event("requests-changed")
  );
}