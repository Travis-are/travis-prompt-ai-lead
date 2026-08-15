"use client";

import { useState, useEffect } from "react";
import { Save, Plus, Trash2 } from "lucide-react";

type Product = {
  id?: string;
  name: string;
  description: string;
  targetCustomer: string;
  priceRange: string;
  availability: string;
  requirements: string;
  faq: string;
  benefits: string;
  restrictions: string;
  links: string;
};

export default function ConfigPage() {
  const [saved, setSaved] = useState(false);
  const [config, setConfig] = useState({
    businessName: "",
    industry: "",
    description: "",
    website: "",
    locations: "",
    serviceAreas: "",
    businessHours: "",
    contactEmail: "",
    contactPhone: "",
    emergencyContact: "",
    brandTone: "professional",
    formalityLevel: "formal",
    greeting: "Hello",
    wordsToUse: "",
    wordsToAvoid: "",
    responseLength: "concise",
    languages: "en",
    idealCustomer: "",
    buyingSignals: "",
    disqualifiers: "",
    leadScoringRules: "",
    qualificationQuestions: "",
    followUpTiming: "1-2 days",
    followUpLimit: 3,
    assignedTeam: "",
    appointmentTypes: "",
    appointmentDuration: "",
    availableHours: "",
    bookingLink: "",
    minNoticePeriod: "",
    cancellationPolicy: "",
    confirmationMessage: "",
    humanContactOption: "",
    escalationEmail: "",
    escalationPhone: "",
    teamNotification: "",
    escalationCategories: "",
    responseExpectation: "",
  });
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/config")
      .then((r) => r.json())
      .then((data) => {
        if (data.config) setConfig({ ...config, ...data.config });
        if (data.products) setProducts(data.products);
      })
      .catch(() => {});
  }, []);

  const handleChange = (field: string, value: string | number) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const addProduct = () => {
    setProducts([...products, { name: "", description: "", targetCustomer: "", priceRange: "", availability: "", requirements: "", faq: "", benefits: "", restrictions: "", links: "" }]);
  };

  const updateProduct = (idx: number, field: string, value: string) => {
    const updated = [...products];
    updated[idx] = { ...updated[idx], [field]: value };
    setProducts(updated);
  };

  const removeProduct = (idx: number) => {
    setProducts(products.filter((_, i) => i !== idx));
  };

  const save = async () => {
    await fetch("/api/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ config, products }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );

  const Field = ({ label, value, onChange, type = "text", placeholder = "" }: any) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {type === "textarea" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      )}
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Business Configuration</h1>
        <button
          onClick={save}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
        >
          <Save size={16} />
          {saved ? "Saved!" : "Save Configuration"}
        </button>
      </div>

      <Section title="Business Profile">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Business Name" value={config.businessName} onChange={(v: string) => handleChange("businessName", v)} />
          <Field label="Industry" value={config.industry} onChange={(v: string) => handleChange("industry", v)} />
          <Field label="Website" value={config.website} onChange={(v: string) => handleChange("website", v)} />
          <Field label="Locations" value={config.locations} onChange={(v: string) => handleChange("locations", v)} />
          <Field label="Service Areas" value={config.serviceAreas} onChange={(v: string) => handleChange("serviceAreas", v)} />
          <Field label="Business Hours" value={config.businessHours} onChange={(v: string) => handleChange("businessHours", v)} />
          <Field label="Contact Email" value={config.contactEmail} onChange={(v: string) => handleChange("contactEmail", v)} />
          <Field label="Contact Phone" value={config.contactPhone} onChange={(v: string) => handleChange("contactPhone", v)} />
          <Field label="Emergency Contact" value={config.emergencyContact} onChange={(v: string) => handleChange("emergencyContact", v)} />
        </div>
        <Field label="Description" value={config.description} onChange={(v: string) => handleChange("description", v)} type="textarea" />
      </Section>

      <Section title="Brand Settings">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Brand Tone" value={config.brandTone} onChange={(v: string) => handleChange("brandTone", v)} />
          <Field label="Formality Level" value={config.formalityLevel} onChange={(v: string) => handleChange("formalityLevel", v)} />
          <Field label="Preferred Greeting" value={config.greeting} onChange={(v: string) => handleChange("greeting", v)} />
          <Field label="Response Length" value={config.responseLength} onChange={(v: string) => handleChange("responseLength", v)} />
          <Field label="Languages Supported" value={config.languages} onChange={(v: string) => handleChange("languages", v)} />
          <Field label="Words to Use" value={config.wordsToUse} onChange={(v: string) => handleChange("wordsToUse", v)} />
          <Field label="Words to Avoid" value={config.wordsToAvoid} onChange={(v: string) => handleChange("wordsToAvoid", v)} />
        </div>
      </Section>

      <Section title="Sales Settings">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Ideal Customer Profile" value={config.idealCustomer} onChange={(v: string) => handleChange("idealCustomer", v)} type="textarea" />
          <Field label="Buying Intent Signals" value={config.buyingSignals} onChange={(v: string) => handleChange("buyingSignals", v)} type="textarea" />
          <Field label="Disqualifying Conditions" value={config.disqualifiers} onChange={(v: string) => handleChange("disqualifiers", v)} type="textarea" />
          <Field label="Lead Scoring Rules" value={config.leadScoringRules} onChange={(v: string) => handleChange("leadScoringRules", v)} type="textarea" />
          <Field label="Qualification Questions" value={config.qualificationQuestions} onChange={(v: string) => handleChange("qualificationQuestions", v)} type="textarea" />
          <Field label="Follow-up Timing" value={config.followUpTiming} onChange={(v: string) => handleChange("followUpTiming", v)} />
          <Field label="Follow-up Limit" value={config.followUpLimit} onChange={(v: string) => handleChange("followUpLimit", parseInt(v) || 3)} type="number" />
          <Field label="Assigned Team/Department" value={config.assignedTeam} onChange={(v: string) => handleChange("assignedTeam", v)} />
        </div>
      </Section>

      <Section title="Appointment Settings">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Appointment Types" value={config.appointmentTypes} onChange={(v: string) => handleChange("appointmentTypes", v)} />
          <Field label="Appointment Duration" value={config.appointmentDuration} onChange={(v: string) => handleChange("appointmentDuration", v)} />
          <Field label="Available Hours" value={config.availableHours} onChange={(v: string) => handleChange("availableHours", v)} />
          <Field label="Booking Link" value={config.bookingLink} onChange={(v: string) => handleChange("bookingLink", v)} />
          <Field label="Minimum Notice Period" value={config.minNoticePeriod} onChange={(v: string) => handleChange("minNoticePeriod", v)} />
          <Field label="Cancellation Policy" value={config.cancellationPolicy} onChange={(v: string) => handleChange("cancellationPolicy", v)} type="textarea" />
          <Field label="Confirmation Message" value={config.confirmationMessage} onChange={(v: string) => handleChange("confirmationMessage", v)} type="textarea" />
        </div>
      </Section>

      <Section title="Human Handoff Settings">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Human Contact Option" value={config.humanContactOption} onChange={(v: string) => handleChange("humanContactOption", v)} />
          <Field label="Escalation Email" value={config.escalationEmail} onChange={(v: string) => handleChange("escalationEmail", v)} />
          <Field label="Escalation Phone" value={config.escalationPhone} onChange={(v: string) => handleChange("escalationPhone", v)} />
          <Field label="Team Notification Method" value={config.teamNotification} onChange={(v: string) => handleChange("teamNotification", v)} />
          <Field label="Escalation Categories" value={config.escalationCategories} onChange={(v: string) => handleChange("escalationCategories", v)} type="textarea" />
          <Field label="Response Expectation" value={config.responseExpectation} onChange={(v: string) => handleChange("responseExpectation", v)} />
        </div>
      </Section>

      <Section title="Products & Services">
        {products.map((product, idx) => (
          <div key={idx} className="border border-gray-200 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-sm text-gray-900">Product/Service {idx + 1}</h4>
              <button onClick={() => removeProduct(idx)} className="text-red-500 hover:text-red-700">
                <Trash2 size={16} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Name" value={product.name} onChange={(v: string) => updateProduct(idx, "name", v)} />
              <Field label="Target Customer" value={product.targetCustomer} onChange={(v: string) => updateProduct(idx, "targetCustomer", v)} />
              <Field label="Price Range" value={product.priceRange} onChange={(v: string) => updateProduct(idx, "priceRange", v)} />
              <Field label="Availability" value={product.availability} onChange={(v: string) => updateProduct(idx, "availability", v)} />
              <Field label="Description" value={product.description} onChange={(v: string) => updateProduct(idx, "description", v)} type="textarea" />
              <Field label="Requirements" value={product.requirements} onChange={(v: string) => updateProduct(idx, "requirements", v)} type="textarea" />
              <Field label="FAQ" value={product.faq} onChange={(v: string) => updateProduct(idx, "faq", v)} type="textarea" />
              <Field label="Benefits" value={product.benefits} onChange={(v: string) => updateProduct(idx, "benefits", v)} type="textarea" />
              <Field label="Restrictions" value={product.restrictions} onChange={(v: string) => updateProduct(idx, "restrictions", v)} type="textarea" />
              <Field label="Links" value={product.links} onChange={(v: string) => updateProduct(idx, "links", v)} />
            </div>
          </div>
        ))}
        <button
          onClick={addProduct}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Plus size={16} />
          Add Product/Service
        </button>
      </Section>
    </div>
  );
}
