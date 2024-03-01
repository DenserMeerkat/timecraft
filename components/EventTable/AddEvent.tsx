"use client";

import React, { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppContext } from "@/lib/AppStateContext";
import { toast } from "@/components/ui/use-toast";
import { JointCourse } from "@/lib/types";
import { courseSchema } from "@/lib/schemas";
import HourGrid from "@/components/common/HourGrid";
import { MultiCourseSelect } from "../CourseTable/MultiCourseSelect";

export const AddEvent = (props: any) => {
  const { open, setOpen } = props;
  const {
    hours,
    days,
    lock,
    faculties,
    courses,
    subjects,
    updateJointCourseSchemas,
  } = useAppContext();
  const [facOccupiedHours, setFacOccupiedHours] = useState<number[]>([]);
  const [courseHours, setCourseHours] = useState<number | undefined>(undefined);
  const JointCourseSchema = z.object({
    courses: z.array(courseSchema).min(1, { message: "Select at least 1" }),
    fixedSlots: z.array(z.number()).min(1, { message: "Select at least 1" }),
  });
  const form = useForm<z.infer<typeof JointCourseSchema>>({
    resolver: zodResolver(JointCourseSchema),
  });
  function onSubmit(data: z.infer<typeof JointCourseSchema>) {
    const subject: JointCourse = data;
    updateJointCourseSchemas([...subjects, subject]);
    form.reset();
    closeAlertDialog();
    toast({
      title: "New Event added successfully",
      description: (
        <p>
          {data.courses && (
            <>
              <span className="mx-1">•</span>
              {data.courses.map((course) => course.code).join(", ")}
            </>
          )}
        </p>
      ),
    });
  }

  useEffect(() => {
    if (form.watch("courses")?.length > 0) {
      const hours = form.watch("courses")?.[0].hours;
      let occupiedHours: number[] = [];
      form
        .watch("courses")
        ?.forEach((course) =>
          course.faculties.forEach((faculty) =>
            occupiedHours.push(
              ...(faculty.occupiedSlots?.map((slot) => slot) || []),
            ),
          ),
        );
      setFacOccupiedHours(occupiedHours);
      setCourseHours(hours);
    } else {
      setFacOccupiedHours([]);
      setCourseHours(undefined);
    }
  }, [form.watch("courses")]);

  const closeAlertDialog = () => {
    form.reset();
    setOpen(false);
  };

  return (
    <AlertDialogContent className="h-fit max-h-screen overflow-y-auto sm:max-w-[425px]">
      <AlertDialogHeader>
        <AlertDialogTitle>{`New Event`}</AlertDialogTitle>
        <AlertDialogDescription>
          Create a new unique Event. Click add when you&apos;re done.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <ScrollArea>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 px-2 pt-1"
          >
            <FormLabel>Courses</FormLabel>
            <FormField
              control={form.control}
              name="courses"
              render={({ field: { ...field } }) => (
                <MultiCourseSelect
                  label="Courses"
                  placeholder={`${
                    courses.length > 0 ? "" : "No Courses added yet."
                  } `}
                  data={courses ?? []}
                  {...field}
                  value={field.value ?? []}
                  onChange={field.onChange}
                />
              )}
            />

            {form.watch("courses")?.length > 0 && (
              <FormItem>
                <FormLabel>Hours</FormLabel>
                <Input id="hours" placeholder="" value={courseHours} disabled />
                <FormMessage />
              </FormItem>
            )}

            <FormField
              control={form.control}
              name="fixedSlots"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fixed Slots</FormLabel>
                  <HourGrid
                    columns={hours!}
                    rows={days!}
                    bg="orange"
                    value={field.value}
                    onChange={field.onChange}
                    unselectable={facOccupiedHours}
                    maxSelection={courseHours}
                    disabled={courseHours === undefined}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <AlertDialogFooter className="pt-4">
              <Button
                variant={"secondary"}
                type="button"
                onClick={closeAlertDialog}
                className="mt-4 min-[640px]:mt-0"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={faculties.length == 0 || courses.length == 0}
              >
                Add Event
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </ScrollArea>
    </AlertDialogContent>
  );
};