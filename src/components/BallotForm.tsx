import { FormSection } from '@/components/FormSection';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { COLORS } from '@/lib/colors';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { GripVerticalIcon } from 'lucide-react';
import {
  BallotResponse,
  BallotFormData,
  ballotFormSchema,
} from '@/lib/schemas';
import { Form } from '@/components/ui/form';

export function BallotForm({
  ballot,
  electionId,
  onFormSubmit,
  isSubmitting,
  voterId,
}: {
  ballot: BallotResponse['ballot'];
  electionId: string;
  onFormSubmit: (form: BallotFormData) => void;
  isSubmitting: boolean;
  voterId: number;
}) {
  const form = useForm<BallotFormData>({
    resolver: zodResolver(ballotFormSchema),
    defaultValues: {
      electionId,
      candidates: ballot.candidates,
      voterId,
    },
  });
  const candidates = form.watch().candidates;
  const handleOrderChange = (newCandidates: BallotFormData['candidates']) => {
    console.log(newCandidates);
    form.setValue('candidates', newCandidates);
  };

  return (
    <Card className="mx-auto w-full max-w-[48rem] space-y-2">
      <CardHeader>
        <CardTitle>Ballot</CardTitle>
        <CardTitle>{ballot.electionInfo.name}</CardTitle>
        <CardDescription>{ballot.electionInfo.description}</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onFormSubmit)}>
          <CardContent>
            <FormSection label="Candidates">
              <RankCandidates
                candidates={candidates}
                onOrderChange={handleOrderChange}
              />
            </FormSection>
          </CardContent>

          <CardFooter className="flex justify-end">
            <Button disabled={isSubmitting} type="submit">
              Submit
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

function RankCandidates({
  candidates,
  onOrderChange,
}: {
  candidates: BallotFormData['candidates'];
  onOrderChange: (newCandidates: BallotFormData['candidates']) => void;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!active || !over) return;

    if (active.id !== over.id) {
      const oldIndex = candidates.findIndex((i) => i.id === active.id);
      const newIndex = candidates.findIndex((i) => i.id === over.id);
      const newCandidates = arrayMove(candidates, oldIndex, newIndex);
      onOrderChange(newCandidates);
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={candidates}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-4">
          {candidates.map((c) => (
            <CandidateCard key={c.id} candidate={c} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

function CandidateCard({
  candidate,
}: {
  candidate: BallotResponse['ballot']['candidates'][0];
}) {
  const { attributes, listeners, setNodeRef, transform, transition, index } =
    useSortable({ id: candidate.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'grab',
    backgroundColor: COLORS[candidate.color]['600'],
  };
  return (
    <Card
      className="relative pl-4 text-white"
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <div className="absolute inset-y-0 left-4 flex flex-col justify-center">
        <GripVerticalIcon />
      </div>
      <CardHeader>
        <CardTitle>
          {index + 1}. {candidate.name}
        </CardTitle>
      </CardHeader>
    </Card>
  );
}
