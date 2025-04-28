
import React from "react";
import { Input } from "@/components/ui/input";

interface PaymentInfoTabProps {
  formData: {
    bankDetails?: {
      accountName: string;
      accountNumber: string;
      ifscCode: string;
      bankName: string;
    };
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PaymentInfoTab: React.FC<PaymentInfoTabProps> = ({
  formData,
  handleChange,
}) => {
  const bankDetails = formData.bankDetails || {
    accountName: "",
    accountNumber: "",
    ifscCode: "",
    bankName: ""
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-base font-medium">Bank Account Details</h3>
        <p className="text-sm text-muted-foreground">
          This information is used for processing your monthly payments
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="bankDetails.accountName" className="text-sm font-medium">
              Account Holder Name
            </label>
            <Input
              id="bankDetails.accountName"
              name="bankDetails.accountName"
              value={bankDetails.accountName}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="bankDetails.accountNumber" className="text-sm font-medium">
              Account Number
            </label>
            <Input
              id="bankDetails.accountNumber"
              name="bankDetails.accountNumber"
              value={bankDetails.accountNumber}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="bankDetails.ifscCode" className="text-sm font-medium">
              IFSC Code
            </label>
            <Input
              id="bankDetails.ifscCode"
              name="bankDetails.ifscCode"
              value={bankDetails.ifscCode}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="bankDetails.bankName" className="text-sm font-medium">
              Bank Name
            </label>
            <Input
              id="bankDetails.bankName"
              name="bankDetails.bankName"
              value={bankDetails.bankName}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentInfoTab;
