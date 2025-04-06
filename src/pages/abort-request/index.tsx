import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AxiosCancelTokenExample from "./axios-cancel-token";
import FetchAbortControllerExample from "./fetch-abort-example";
import ReactQueryAbortControllerExample from "./react-query-fetch-example";
import RTKQueryExample from "./rtk-query-example";

export default function AbortRequestPage() {
  return (
    <Tabs defaultValue="axios-cancel-token">
      <TabsList className="w-full *:w-full">
        <TabsTrigger value="axios-cancel-token">Axios Cancel Token</TabsTrigger>
        <TabsTrigger value="abort-controller">Abort Controller</TabsTrigger>
        <TabsTrigger value="react-query-fetch-api">
          React Query Fetch API
        </TabsTrigger>
        <TabsTrigger value="rtk-query">RTK Query</TabsTrigger>
      </TabsList>
      <TabsContent value="axios-cancel-token">
        <AxiosCancelTokenExample />
      </TabsContent>
      <TabsContent value="abort-controller">
        <FetchAbortControllerExample />
      </TabsContent>
      <TabsContent value="react-query-fetch-api">
        <ReactQueryAbortControllerExample />
      </TabsContent>
      <TabsContent value="rtk-query">
        <RTKQueryExample />
      </TabsContent>
    </Tabs>
  );
}
