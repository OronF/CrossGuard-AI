'use client'

import { useState } from 'react';

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
import { Label } from "./ui/label";
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from "./ui/input";
import { createId } from '@paralleldrive/cuid2';

export default function Configuration() {
    const id = createId(); 
    console.log(id);
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
                        <TabsContent value="Score-Range" className="flex flex-col gap-5">
                            <ScoreRange thresholdParam={56} thresholdType={true} />
                            <ScoreRange thresholdParam={56} thresholdType={false} />
                            <Button className="mx-auto bg-blue-500 text-white">Save</Button>
                        </TabsContent>
                        <TabsContent value="Members-Whitelist">
<ListTable tableType="members" />
                        </TabsContent>
                        <TabsContent value="Messages-Whitelist">
                            <ListTable tableType="whitelist" />
                        </TabsContent>
                        <TabsContent value="Messages-Blacklist">
                            <ListTable tableType="blacklist" />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}

function ScoreRange({thresholdParam, thresholdType} : {thresholdParam: number, thresholdType: boolean}) {
    const [score, setScore] = useState(thresholdParam);
    
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Label htmlFor="min-score">{thresholdType ? "Minimum Score (Safe Threshold)" : "Maximum Score (Spam Threshold)"}</Label>
                      <span className="text-sm font-medium">{score}%</span>
                    </div>
                    <Slider
                      id="min-score"
                      min={0}
                      max={100}
                      value={[score]}
                      onValueChange={(value) => setScore(value[0])}
                      className="[&_[data-slot=slider-track]]:bg-blue-200 [&_[data-slot=slider-range]]:bg-blue-500"
                    />
                    <p className="text-sm text-muted-foreground">
                      {thresholdType ? "Messages with scores below this are considered safe" : "Messages with scores above this will be flagged as spam"}
                    </p>
        </div>
    )
}

function ListTable({tableType} : {tableType: string}) {
    const [items, setItems] = useState<string[]>(
        tableType === 'members' 
            ? ['John Doe', 'Jane Smith', 'Bob Johnson']
            : tableType === 'whitelist'
            ? ['Official announcement', 'Meeting scheduled']
            : ['Click here for free money', 'Crypto giveaway']
    );
    const [inputValue, setInputValue] = useState('');

    const getTableConfig = () => {
        switch(tableType) {
            case 'members':
                return {
                    columnName: 'Member Name',
                    placeholder: 'Enter member name',
                    description: 'Members in the whitelist are exempt from spam detection'
                };
            case 'whitelist':
                return {
                    columnName: 'Message Pattern',
                    placeholder: 'Enter message pattern',
                    description: 'Messages containing these patterns will be automatically approved'
                };
            case 'blacklist':
                return {
                    columnName: 'Message Pattern',
                    placeholder: 'Enter message pattern',
                    description: 'Messages containing these patterns will be automatically blocked'
                };
        }
    };

    const config = getTableConfig();

    const handleAdd = () => {
        if (inputValue.trim()) {
            setItems([...items, inputValue]);
            setInputValue('');
        }
    };

    const handleDelete = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    return (
        <div className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">{config?.description}</p>
            <table className="w-full">
                <thead>
                    <tr className="border-b">
                        <th className="text-left py-2 font-semibold">{config?.columnName}</th>
                        <th className="text-right py-2 font-semibold">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, index) => (
                        <tr key={index} className="border-b">
                            <td className="py-3">{item}</td>
                            <td className="text-right">
                                <button onClick={() => handleDelete(index)} className="text-red-500 hover:text-red-700">
                                    <Trash2 size={20} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex gap-2">
                <Input
                    placeholder={config?.placeholder}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
                />
                <Button onClick={handleAdd} className="bg-blue-500 text-white">
                    <Plus size={20} />
                </Button>
            </div>
        </div>
    );
}