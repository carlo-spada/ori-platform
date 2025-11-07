import { Check, X } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export interface ComparisonFeature {
  feature: string;
  free: string | boolean;
  plus: string | boolean;
  premium: string | boolean;
}

export interface FeatureComparisonTableProps {
  features: ComparisonFeature[];
}

function renderCell(value: string | boolean) {
  if (typeof value === 'boolean') {
    return value ? (
      <Check className="h-5 w-5 text-primary mx-auto" aria-label="Included" />
    ) : (
      <X className="h-5 w-5 text-muted-foreground/40 mx-auto" aria-label="Not included" />
    );
  }
  return <span className="text-sm text-foreground">{value}</span>;
}

export function FeatureComparisonTable({ features }: FeatureComparisonTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40%] text-foreground font-semibold">Feature</TableHead>
            <TableHead className="text-center text-foreground font-semibold">Free</TableHead>
            <TableHead className="text-center text-foreground font-semibold">Plus</TableHead>
            <TableHead className="text-center text-foreground font-semibold">Premium</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {features.map((row, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium text-foreground">{row.feature}</TableCell>
              <TableCell className="text-center">{renderCell(row.free)}</TableCell>
              <TableCell className="text-center">{renderCell(row.plus)}</TableCell>
              <TableCell className="text-center">{renderCell(row.premium)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
