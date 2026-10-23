import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/registry/reziui/ui/accordion";

// Answers kept to one line: the landing page shows this example in a fixed
// 222px card, where three rows and one open panel only fit at that length.
const FAQ = [
  { value: "accessible", question: "Is it accessible?", answer: "Yes, with full keyboard support." },
  { value: "production", question: "Can I use it in production?", answer: "Yes. You own the copied source." },
  { value: "dark-mode", question: "Does it support dark mode?", answer: "Yes, through the theme tokens." },
];

export default function AccordionDemo() {
  return (
    <Accordion type="single" collapsible defaultValue="production" className="w-full max-w-md">
      {FAQ.map(({ value, question, answer }) => (
        <AccordionItem key={value} value={value}>
          <AccordionTrigger>{question}</AccordionTrigger>
          <AccordionContent>{answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
