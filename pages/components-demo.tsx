import React from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

export default function ComponentsDemo() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">shadcn/ui Components Demo</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Buttons */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Buttons</h2>
          <div className="flex flex-wrap gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>
        </Card>
        
        {/* Inputs */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Inputs</h2>
          <div className="space-y-4">
            <Input placeholder="Default input" />
            <Input placeholder="Disabled input" disabled />
          </div>
        </Card>
        
        {/* Select */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Select</h2>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="option1">Option 1</SelectItem>
              <SelectItem value="option2">Option 2</SelectItem>
              <SelectItem value="option3">Option 3</SelectItem>
            </SelectContent>
          </Select>
        </Card>
        
        {/* Badges */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Badges</h2>
          <div className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
          </div>
        </Card>
      </div>
    </div>
  );
}