"use client"

import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface MultiSelectComboboxOption {
  value: string
  label: string
  disabled?: boolean
}

export interface MultiSelectComboboxProps {
  options: MultiSelectComboboxOption[]
  values?: string[]
  onValuesChange?: (values: string[]) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  className?: string
  disabled?: boolean
  maxItems?: number
  showSelectedCount?: boolean
  allowClearAll?: boolean
}

export function MultiSelectCombobox({
  options,
  values = [],
  onValuesChange,
  placeholder = "Select options...",
  searchPlaceholder = "Search options...",
  emptyText = "No option found.",
  className,
  disabled = false,
  maxItems,
  showSelectedCount = true,
  allowClearAll = true,
}: MultiSelectComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState("")

  const selectedOptions = options.filter((option) => values.includes(option.value))
  const isMaxReached = maxItems ? values.length >= maxItems : false

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchValue.toLowerCase())
  )

  const handleSelect = (optionValue: string) => {
    const newValues = values.includes(optionValue)
      ? values.filter((value) => value !== optionValue)
      : [...values, optionValue]
    
    onValuesChange?.(newValues)
  }

  const handleRemove = (optionValue: string, event?: React.MouseEvent) => {
    event?.preventDefault()
    event?.stopPropagation()
    const newValues = values.filter((value) => value !== optionValue)
    onValuesChange?.(newValues)
  }

  const handleClearAll = (event?: React.MouseEvent) => {
    event?.preventDefault()
    event?.stopPropagation()
    onValuesChange?.([])
  }

  const getDisplayText = () => {
    if (selectedOptions.length === 0) {
      return placeholder
    }

    if (showSelectedCount && selectedOptions.length > 2) {
      return `${selectedOptions.length} items selected`
    }

    return selectedOptions.map(option => option.label).join(", ")
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between min-h-9 h-auto py-2",
            selectedOptions.length === 0 && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <div className="flex flex-wrap gap-1 max-w-full">
            {selectedOptions.length > 0 ? (
              <div className="flex flex-wrap gap-1 max-w-full">
                {selectedOptions.length <= 2 ? (
                  selectedOptions.map((option) => (
                    <Badge
                      key={option.value}
                      variant="secondary"
                      className="text-xs px-2 py-0.5 flex items-center gap-1"
                    >
                      {option.label}
                      <X
                        className="h-3 w-3 cursor-pointer hover:bg-muted rounded-full"
                        onClick={(e) => handleRemove(option.value, e)}
                      />
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm">
                    {showSelectedCount 
                      ? `${selectedOptions.length} items selected`
                      : selectedOptions.map(option => option.label).join(", ")
                    }
                  </span>
                )}
              </div>
            ) : (
              <span className="text-sm">{placeholder}</span>
            )}
          </div>
          <div className="flex items-center gap-1 ml-2">
            {allowClearAll && selectedOptions.length > 0 && (
              <X
                className="h-4 w-4 cursor-pointer hover:bg-muted rounded-full opacity-50 hover:opacity-100"
                onClick={handleClearAll}
              />
            )}
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput 
            placeholder={searchPlaceholder}
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              <div className="px-2 py-1.5 text-xs text-muted-foreground">
                {selectedOptions.length > 0 && (
                  <div className="flex justify-between items-center">
                    <span>{selectedOptions.length} selected</span>
                    {allowClearAll && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-1 text-xs"
                        onClick={handleClearAll}
                      >
                        Clear all
                      </Button>
                    )}
                  </div>
                )}
                {maxItems && (
                  <div className="mt-1">
                    Max {maxItems} items {isMaxReached && "(limit reached)"}
                  </div>
                )}
              </div>
              {filteredOptions.map((option) => {
                const isSelected = values.includes(option.value)
                const isDisabled = option.disabled || (isMaxReached && !isSelected)
                
                return (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    disabled={isDisabled}
                    onSelect={() => {
                      if (!isDisabled) {
                        handleSelect(option.value)
                      }
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        isSelected ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.label}
                    {isDisabled && !option.disabled && (
                      <span className="ml-auto text-xs text-muted-foreground">
                        (limit reached)
                      </span>
                    )}
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
