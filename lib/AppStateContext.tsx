import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { Faculty, Course, JointCourseSchema } from "./types";

interface AppContextType {
  hours: number | null;
  days: number | null;
  lock: boolean;
  faculties: Faculty[];
  courses: Course[];
  subjects: JointCourseSchema[];
  groups: string[];
  updateHours: (hours: number | null) => void;
  updateDays: (days: number | null) => void;
  updateLock: () => void;
  updateFaculties: (faculties: Faculty[]) => void;
  updateCourses: (courses: Course[]) => void;
  updateJointCourseSchemas: (subjects: JointCourseSchema[]) => void;
  updateGroups: (groups: string[]) => void;
  reset: () => void;
}

const defaultAppContext: AppContextType = {
  hours: null,
  days: null,
  lock: false,
  faculties: [],
  courses: [],
  subjects: [],
  groups: [],
  updateHours: () => {},
  updateDays: () => {},
  updateLock: () => {},
  updateFaculties: () => {},
  updateCourses: () => {},
  updateJointCourseSchemas: () => {},
  updateGroups: () => {},
  reset: () => {},
};
const AppContext = createContext<AppContextType>(defaultAppContext);

interface AppContextProviderProps {
  children: ReactNode;
}

export const AppContextProvider: React.FC<AppContextProviderProps> = ({
  children,
}) => {
  const [hours, setHours] = useState<number | null>(null);
  const [days, setDays] = useState<number | null>(null);
  const [lock, setLock] = useState(false);
  const [faculties, setFaculties] = useState([] as Faculty[]);
  const [courses, setCourses] = useState([] as Course[]);
  const [subjects, setJointCourseSchemas] = useState([] as JointCourseSchema[]);
  const [groups, setGroups] = useState([] as string[]);
  const updateHours = (hours: number | null) => {
    setHours(hours);
  };
  const updateDays = (days: number | null) => {
    setDays(days);
  };
  const updateLock = () => {
    setLock((prev) => !prev);
  };
  const updateFaculties = (faculties: Faculty[]) => {
    setFaculties(faculties);
  };
  const updateCourses = (courses: Course[]) => {
    setCourses(courses);
  };
  const updateJointCourseSchemas = (subjects: JointCourseSchema[]) => {
    setJointCourseSchemas(subjects);
  };
  const updateGroups = (groups: string[]) => {
    setGroups(groups);
  };

  const resetState = () => {
    setHours(0);
    setDays(0);
    setLock(false);
    setFaculties([]);
    setCourses([]);
    setJointCourseSchemas([]);
    setGroups([]);
    localStorage.removeItem("appState");
  };

  const state: AppContextType = {
    hours,
    days,
    lock,
    faculties,
    courses,
    subjects,
    groups,
    updateLock,
    updateHours,
    updateDays,
    updateCourses,
    updateFaculties,
    updateJointCourseSchemas,
    updateGroups,
    reset: resetState,
  };

  useEffect(() => {
    const storedState = localStorage.getItem("appState");
    if (storedState) {
      const parsedState = JSON.parse(storedState);
      setHours(parsedState.hours);
      setDays(parsedState.days);
      setLock(parsedState.lock);
      setFaculties(parsedState.faculties);
      setCourses(parsedState.courses);
      setJointCourseSchemas(parsedState.subjects);
      setGroups(parsedState.groups);
    }
    console.log("storedState", storedState);
  }, []);

  useEffect(() => {
    const stateToStore = JSON.stringify({
      hours,
      days,
      lock,
      faculties,
      courses,
      subjects,
      groups,
    });
    localStorage.setItem("appState", stateToStore);
  }, [hours, days, lock, faculties, courses, subjects, groups]);

  return <AppContext.Provider value={state}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppContextProvider");
  }
  return context;
};
