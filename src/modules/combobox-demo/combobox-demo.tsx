'use client';

import { useState } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Combobox, type ComboboxOption } from '@/components/ui/combobox';
import { Label } from '@/components/ui/label';
import { MultiSelectCombobox, type MultiSelectComboboxOption } from '@/components/ui/multi-select-combobox';
import { Separator } from '@/components/ui/separator';

// sample options data
const frameworks: ComboboxOption[] = [
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue.js' },
    { value: 'angular', label: 'Angular' },
    { value: 'svelte', label: 'Svelte' },
    { value: 'next', label: 'Next.js' },
    { value: 'nuxt', label: 'Nuxt.js' },
    { value: 'gatsby', label: 'Gatsby' },
    { value: 'remix', label: 'Remix' },
];

const colors: MultiSelectComboboxOption[] = [
    { value: 'red', label: 'Red' },
    { value: 'blue', label: 'Blue' },
    { value: 'green', label: 'Green' },
    { value: 'yellow', label: 'Yellow' },
    { value: 'purple', label: 'Purple' },
    { value: 'orange', label: 'Orange' },
    { value: 'pink', label: 'Pink' },
    { value: 'cyan', label: 'Cyan' },
    { value: 'brown', label: 'Brown' },
    { value: 'gray', label: 'Gray' },
];

const languages: MultiSelectComboboxOption[] = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'csharp', label: 'C#' },
    { value: 'cpp', label: 'C++' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' },
    { value: 'php', label: 'PHP' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'swift', label: 'Swift' },
    { value: 'kotlin', label: 'Kotlin' },
];

export function ComboboxDemo() {
    // single selection state
    const [selectedFramework, setSelectedFramework] = useState<string>('');

    // multi-selection state
    const [selectedColors, setSelectedColors] = useState<string[]>([]);
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
    const [limitedSelection, setLimitedSelection] = useState<string[]>([]);

    return (
        <div className="container mx-auto max-w-4xl space-y-8 p-6">
            <div className="text-center">
                <h1 className="mb-2 text-4xl font-bold text-gray-800">
                    Combobox Component Demo
                </h1>
                <p className="text-lg text-gray-600">
                    Single & Multi Combobox Demo
                </p>
            </div>

            {/* Single Selection Demo */}
            <Card>
                <CardHeader>
                    <CardTitle>Single Combobox</CardTitle>
                    <CardDescription>standard single-select dropdown combobox</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="framework-select">select framework</Label>
                        <Combobox
                            options={frameworks}
                            value={selectedFramework}
                            onValueChange={setSelectedFramework}
                            placeholder="select a framework..."
                            className="w-full max-w-md"
                        />
                    </div>
                    <div className="rounded-md bg-muted p-3">
                        <p className="text-sm">
                            current selection:
                            {selectedFramework || 'no selection'}
                        </p>
                    </div>
                </CardContent>
            </Card>

            <Separator />

            {/* Multi Selection Demo */}
            <Card>
                <CardHeader>
                    <CardTitle>Multi Combobox</CardTitle>
                    <CardDescription>support multi-selection</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label>select colors</Label>
                        <MultiSelectCombobox
                            options={colors}
                            values={selectedColors}
                            onValuesChange={setSelectedColors}
                            placeholder="select colors..."
                            className="w-full max-w-md"
                        />
                        <div className="rounded-md bg-muted p-3">
                            <p className="text-sm">
                                selected:
                                {' '}
                                {selectedColors.join(', ') || 'no selection'}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>select programming languages</Label>
                        <MultiSelectCombobox
                            options={languages}
                            values={selectedLanguages}
                            onValuesChange={setSelectedLanguages}
                            placeholder="select programming languages..."
                            showSelectedCount={true}
                            className="w-full max-w-md"
                        />
                        <div className="rounded-md bg-muted p-3">
                            <p className="text-sm">
                                selected:
                                {' '}
                                {selectedLanguages.join(', ') || 'no selection'}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>limitation selection（Up to 3 items）</Label>
                        <MultiSelectCombobox
                            options={colors}
                            values={limitedSelection}
                            onValuesChange={setLimitedSelection}
                            placeholder="up to select 3 items..."
                            maxItems={3}
                            className="w-full max-w-md"
                        />
                        <div className="rounded-md bg-muted p-3">
                            <p className="text-sm">
                                selected:
                                {' '}
                                {limitedSelection.join(', ') || 'no selection'}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
