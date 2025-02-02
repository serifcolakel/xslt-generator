import { Label } from "@/components/ui/label";
import { PiIcon, WholeWord } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";

function Page({
  children,
  pageIndex,
}: {
  children: React.ReactNode;
  pageIndex: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    amount: 0.5,
  });

  if (isInView) {
    console.log(`Page ${pageIndex} is in view`);
  }

  return (
    <div
      ref={ref}
      className="relative h-[1154px] flex flex-col items-center mx-auto justify-between gap-y-4 bg-gradient-to-t from-primary to-secondary border-destructive min-w-[816px]"
    >
      <Header />
      <main className="flex flex-col w-full h-full gap-y-4">{children}</main>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <div className="flex items-center justify-center w-full h-16 bg-gray-500">
      <h1>Header</h1>
    </div>
  );
}

function Footer() {
  return (
    <div className="flex items-center justify-center w-full h-16 bg-gray-500">
      <h1>Footer</h1>
    </div>
  );
}

const useHandleAction = () => {
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current!,
    documentTitle: "Cari Ekstre",
    onBeforePrint() {
      const triggerButton = document.getElementById(
        "print-button"
      ) as HTMLButtonElement | null;

      if (triggerButton) {
        triggerButton.disabled = true;
      }
    },
    onAfterPrint() {
      const triggerButton = document.getElementById(
        "print-button"
      ) as HTMLButtonElement | null;

      if (triggerButton) {
        triggerButton.disabled = false;
      }
    },
  });

  return { componentRef, handlePrint };
};

function LeftSide() {
  return (
    <aside className="sticky top-0 w-full p-4 bg-gray-200 rounded-lg">
      <Label>{Math.random() * 100}</Label>
    </aside>
  );
}

function RightSide() {
  return (
    <aside className="sticky top-0 w-full p-4 bg-gray-200 rounded-lg">
      <Label>{Math.random() * 100}</Label>
    </aside>
  );
}

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex flex-row w-full h-screen p-4 overflow-hidden overflow-y-scroll rounded-lg gap-x-2">
      {children}
    </div>
  );
}

export default function PrintPage() {
  const { componentRef, handlePrint } = useHandleAction();
  return (
    <RootLayout>
      <LeftSide />

      <div ref={componentRef} className="mx-auto space-y-4">
        <Page pageIndex="1">
          <Label variant="destructive" size="default" weight="default">
            Hello, World! <WholeWord />
          </Label>
        </Page>
        <Page pageIndex="2">
          <main className="flex flex-col h-full gap-y-4">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="text-4xl font-bold text-white"
            >
              <Label>{Math.random() * 100}</Label>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              drag
              transition={{ duration: 1 }}
              className="absolute top-0 left-0 text-lg font-semibold text-white"
            >
              <Label>This is a print button example.</Label>
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="flex p-2 w-fit gap-x-2 hover:bg-gray-500 hover:shadow-md hover:cursor-pointer group"
            >
              <PiIcon className="hidden w-6 h-6 text-white group-hover:block" />
              <Button
                id="print-button"
                onClick={handlePrint}
                variant="secondary"
                size="default"
              >
                Click me
              </Button>
              <Button
                id="print-button"
                onClick={handlePrint}
                variant="secondary"
                size="default"
              >
                Click me
              </Button>
            </motion.div>
          </main>
        </Page>
        <Page pageIndex="3">
          <motion.img
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            src="https://via.placeholder.com/50"
            alt="Placeholder"
            className="object-cover object-center w-20 h-20 rounded-md resize"
            contentEditable
            layout
          />
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            contentEditable
            transition={{ duration: 1 }}
            className="text-4xl font-bold text-white"
          >
            Hello, World!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-lg font-semibold text-white"
          >
            This is a print button example.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            drag
            transition={{ duration: 1 }}
            className="absolute top-0 left-0 flex p-2 w-fit gap-x-2 hover:bg-gray-500 hover:shadow-md hover:cursor-pointer group"
          >
            <Button id="print-button" onClick={handlePrint} variant="secondary">
              Click me222
            </Button>
          </motion.div>
        </Page>
      </div>
      <RightSide />
    </RootLayout>
  );
}
