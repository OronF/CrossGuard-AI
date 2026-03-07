import { Separator } from '@/components/ui/separator';
import { 
    Card,
    CardHeader,
    CardFooter,
    CardContent,
    CardDescription,
    CardTitle
 } from '@/components/ui/card';
import { Trash2, Plus, Settings2, Users, MessageSquare, Ban } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress";

export default function Configuration() {
    return (
        <div className="flex flex-col container mx-auto gap-4">
            <header className="flex flex-col shrink-0 bg-background/40 px-6 gap-2">
                <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div className="flex flex-col min-w-0 gap-1">
                        <h1 className="text-xl font-semibold tracking-tight">Configuration</h1>
                        <p className="text-muted-foreground">
                            CrossGuard AI - Configure bot settings, manage whitelists and blacklists
                        </p>
                    </div>
                </div>
                <Separator />
            </header>

            <Card>
                <CardHeader>
                    <CardTitle>
                        Configuration Settings for Tech Community
                    </CardTitle>
                    <CardDescription>
                        Manage score thresholds and member/message lists
                    </CardDescription>
                    <Separator />
                </CardHeader>

                <CardContent className="flex flex-col gap-4">
                    <Tabs defaultValue="overview" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="Score-Range" className="flex flex-row gap-3"><Settings2 />Score Range</TabsTrigger>
                            <TabsTrigger value="Members-Whitelist" className="flex flex-row gap-3"><Users />Members Whitelist</TabsTrigger>
                            <TabsTrigger value="Messages-Whitelist" className="flex flex-row gap-3"><MessageSquare />Messages Whitelist</TabsTrigger>
                            <TabsTrigger value="Messages-Blacklist" className="flex flex-row gap-3"><Ban />Messages Blacklist</TabsTrigger>
                        </TabsList>
                        <TabsContent value="Score-Range">
                            <ScoreRange />
                        </TabsContent>
                        <TabsContent value="Members-Whitelist">Members Whitelist content</TabsContent>
                        <TabsContent value="Messages-Whitelist">Messages Whitelist content</TabsContent>
                        <TabsContent value="Messages-Blacklist">Messages Blacklist content</TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}

function ScoreRange() {
    return (
        <div>
            <Progress value={56} className="w-full max-w-sm">
                <ProgressLabel>Upload progress</ProgressLabel>
                <ProgressValue />
            </Progress>
        </div>
    )
}