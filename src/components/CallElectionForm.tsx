import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { DateTimePicker } from '@/components/ui/datetime-picker';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ListPlusIcon, Trash2Icon } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { AutosizeTextarea } from '@/components/ui/autosize-textarea';
import { FormSection } from '@/components/FormSection';
import { COLORS } from '@/lib/colors';
import {
  CallElectionFormData,
  callElectionFormSchema,
  CANDIDATE_NAME_MAX_LENGTH,
  CANDIDATES_MAX_LENGTH,
  ELECTION_DESCRIPTION_MAX_LENGTH,
  ELECTION_NAME_MAX_LENGTH,
} from '@/lib/schemas';
import { Fragment } from 'react/jsx-runtime';

const colorOptions = Object.keys(COLORS).map((key) => {
  return {
    value: key as keyof typeof COLORS,
  };
});

function getNextColor(candidates: CallElectionFormData['candidates']) {
  const unusedColors = Object.keys(COLORS).filter(
    (k) => !candidates.some((candidate) => candidate.color === k)
  ) as Array<keyof typeof COLORS>;
  const colorKeys =
    unusedColors.length > 0
      ? unusedColors
      : (Object.keys(COLORS) as Array<keyof typeof COLORS>);
  const randomColor = colorKeys[Math.floor(Math.random() * colorKeys.length)];
  return randomColor;
}

export function CallElectionForm({
  onFormSubmit,
  isSubmitting,
}: {
  onFormSubmit: (form: CallElectionFormData) => void;
  isSubmitting: boolean;
}) {
  const form = useForm<CallElectionFormData>({
    resolver: zodResolver(callElectionFormSchema),
    defaultValues: {
      name: '',
      description: undefined,
      candidateDescriptions: false,
      startDate: new Date(),
      endDate: undefined,
      candidates: [
        {
          name: '',
          color: 'red',
        },
        {
          name: '',
          color: 'blue',
        },
      ],
    },
  });

  const fieldArray = useFieldArray({
    control: form.control,
    name: 'candidates',
  });

  const candidateDescriptionsEnabled = form.getValues('candidateDescriptions');

  return (
    <Card className="mx-auto w-full max-w-[48rem] space-y-2">
      <CardHeader>
        <CardTitle>Call Election</CardTitle>
        <CardDescription>Configure a new election</CardDescription>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onFormSubmit)}>
          <CardContent className="space-y-8">
            {/* Section:Info */}
            <FormSection label="Election Info">
              {/* name */}
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          maxLength={ELECTION_NAME_MAX_LENGTH}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="description">
                        Description{' '}
                        <span className="text-xs text-gray-400">
                          (optional)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <AutosizeTextarea
                          placeholder="What should voters know about this election?"
                          id="description"
                          maxLength={ELECTION_DESCRIPTION_MAX_LENGTH}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </FormSection>

            {/* Section:Rules */}
            <FormSection label="Rules">
              {/* date selection */}
              <div className="flex flex-wrap gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>From</FormLabel>
                      <FormControl>
                        <div>
                          <DateTimePicker
                            hourCycle={12}
                            granularity="minute"
                            displayFormat={{ hour12: 'PPp' }}
                            placeholder="Select start date"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Until</FormLabel>
                      <FormControl>
                        <div>
                          <DateTimePicker
                            hourCycle={12}
                            granularity="minute"
                            displayFormat={{ hour12: 'PPp' }}
                            placeholder="Select end date"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </FormSection>

            {/*  Section:Candidates */}
            <FormSection label="Candidates">
              <div className="flex flex-col gap-4">
                {/* Switch Candidate Descriptions */}
                <FormField
                  control={form.control}
                  name="candidateDescriptions"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2 space-y-0">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="cursor-pointer">
                        Enable Descriptions
                      </FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Candidate inputs */}
                <div className="flex flex-col space-y-4">
                  {fieldArray.fields.map((field, index) => {
                    const isLast = index === fieldArray.fields.length - 1;
                    return (
                      <Fragment key={field.id}>
                        <div className="flex flex-col gap-2">
                          {/* Name, color, delete action */}
                          <div className="flex gap-4">
                            <FormField
                              control={form.control}
                              name={`candidates.${index}.name`}
                              render={({ field }) => (
                                <FormItem className="w-full">
                                  <Input
                                    {...field}
                                    placeholder="Candidate Name"
                                    onChange={field.onChange}
                                    maxLength={CANDIDATE_NAME_MAX_LENGTH}
                                  />
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <div className="grow">
                              <Controller
                                name={`candidates.${index}.color`}
                                control={form.control}
                                render={({ field }) => (
                                  <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                  >
                                    <SelectTrigger className="w-[9.6rem]">
                                      <SelectValue placeholder="Select a color" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectGroup>
                                        {colorOptions.map((o) => (
                                          <SelectItem
                                            key={o.value}
                                            value={o.value}
                                          >
                                            <div className="inline-flex items-center gap-2">
                                              <div
                                                className="h-4 w-4"
                                                style={{
                                                  backgroundColor:
                                                    COLORS[o.value]['500'],
                                                }}
                                              />
                                              <span>{o.value}</span>
                                            </div>
                                          </SelectItem>
                                        ))}
                                      </SelectGroup>
                                    </SelectContent>
                                  </Select>
                                )}
                              />
                            </div>
                            <Button
                              type="button"
                              onClick={() => fieldArray.remove(index)}
                              disabled={fieldArray.fields.length <= 2} // Prevent removing if there are only 2 candidates
                              variant="ghost"
                              className="border border-input px-3 hover:bg-destructive hover:text-white"
                            >
                              <Trash2Icon className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Candidate Description */}
                          {candidateDescriptionsEnabled && (
                            <FormField
                              key={field.id}
                              control={form.control}
                              name={`candidates.${index}.description`}
                              render={({ field }) => (
                                <FormItem>
                                  <AutosizeTextarea
                                    {...field}
                                    placeholder="Candidate Description"
                                  />
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}
                        </div>

                        {!isLast && <hr />}
                      </Fragment>
                    );
                  })}
                </div>

                {/* Add new candidate */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    fieldArray.append({
                      name: '',
                      color: getNextColor(fieldArray.fields),
                    })
                  }
                  className="w-fit px-6"
                  disabled={fieldArray.fields.length === CANDIDATES_MAX_LENGTH}
                >
                  <ListPlusIcon />
                </Button>
              </div>
            </FormSection>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button variant="outline">Cancel</Button>
            <Button disabled={isSubmitting} type="submit">
              Submit
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
