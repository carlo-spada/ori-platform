import { Check, X } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export interface ComparisonFeature {
  feature: string
  free: string | boolean
  plus: string | boolean
  premium: string | boolean
}

export interface FeatureComparisonTableProps {
  features: ComparisonFeature[]
}

function renderCell(value: string | boolean) {
  if (typeof value === 'boolean') {
    return value ? (
      <Check className="mx-auto h-5 w-5 text-primary" aria-label="Included" />
    ) : (
      <X
        className="mx-auto h-5 w-5 text-muted-foreground/40"
        aria-label="Not included"
      />
    )
  }
  return <span className="text-sm text-foreground">{value}</span>
}

export function FeatureComparisonTable({
  features,
}: FeatureComparisonTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40%] font-semibold text-foreground">
              Feature
            </TableHead>
            <TableHead className="text-center font-semibold text-foreground">
              Free
            </TableHead>
            <TableHead className="text-center font-semibold text-foreground">
              Plus
            </TableHead>
            <TableHead className="text-center font-semibold text-foreground">
              Premium
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {features.map((row, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium text-foreground">
                {row.feature}
              </TableCell>
              <TableCell className="text-center">
                {renderCell(row.free)}
              </TableCell>
              <TableCell className="text-center">
                {renderCell(row.plus)}
              </TableCell>
              <TableCell className="text-center">
                {renderCell(row.premium)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
