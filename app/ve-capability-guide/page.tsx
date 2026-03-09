import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import { readFileSync } from 'fs'

const guideMd = readFileSync('public/data/ve-capability-study-guide.md', 'utf8')

export default function VECapabilityGuide() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">VE Capability Guide</h1>
      <Tabs defaultValue="guide" className="relative mr-auto w-full">
        <TabsList>
          <TabsTrigger value="guide">Study Guide</TabsTrigger>
          <TabsTrigger value="cards">Capability Cards</TabsTrigger>
        </TabsList>
        <TabsContent value="guide">
          <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown rehypePlugins={[rehypeRaw]}>
              {guideMd}
            </ReactMarkdown>
          </div>
        </TabsContent>
        <TabsContent value="cards">
          <embed 
            src="/data/Business_Capability_Cards.pdf" 
            type="application/pdf"
            width="100%"
            height="800px" 
          />
          <p className="mt-4 text-sm text-gray-400">PDF embedded from public/data/Business_Capability_Cards.pdf</p>
        </TabsContent>
      </Tabs>
    </div>
  )
}