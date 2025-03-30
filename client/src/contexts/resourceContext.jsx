import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const BranchContext = createContext();

export const useBranch = () => useContext(BranchContext);

export const BRANCH_NAMES = [
    "Biotechnology",
    "Chemical Engineering",
    "Civil Engineering",
    "Computer Science and Engineering",
    "Electrical Engineering",
    "Electronics and Communication Engineering",
    "Materials Engineering",
    "Mechanical Engineering",
    "Production and Industrial Engineering",
    "Engineering and Computational Mechanics"
];

export const BranchProvider = ({ children }) => {
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const API_URL = "https://campusbeacon.onrender.com/api";

    // Fetch all branches
    const fetchBranches = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/branches`);
            setBranches(res.data.data);
        } catch (error) {
            console.error("Error fetching branches", error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    // Create a new branch
    const createBranch = async (branch_name) => {
        if (!BRANCH_NAMES.includes(branch_name)) {
            console.error("Invalid branch name");
            return;
        }
        try {
            const res = await axios.post(`${API_URL}/branches`, { branch_name });
            setBranches([...branches, res.data.data]);
        } catch (error) {
            console.error("Error creating branch", error);
            setError(error);
        }
    };

    // Edit a branch
    const editBranch = async (id, branch_name) => {
        if (!BRANCH_NAMES.includes(branch_name)) {
            console.error("Invalid branch name");
            return;
        }
        try {
            const res = await axios.put(`${API_URL}/branches/${id}`, { branch_name });
            setBranches(branches.map(branch => branch.id === id ? res.data.data : branch));
        } catch (error) {
            console.error("Error updating branch", error);
            setError(error);
        }
    };

    // Delete a branch
    const deleteBranch = async (id) => {
        try {
            await axios.delete(`${API_URL}/branches/${id}`);
            setBranches(branches.filter(branch => branch.id !== id));
        } catch (error) {
            console.error("Error deleting branch", error);
            setError(error);
        }
    };

    useEffect(() => {
        fetchBranches();
    }, []);

    return (
        <BranchContext.Provider value={{ branches, loading, error, createBranch, editBranch, deleteBranch, BRANCH_NAMES }}>
            {children}
        </BranchContext.Provider>
    );
};





const YearContext = createContext();

export const useYear = () => useContext(YearContext);

export const YEAR_NAMES = ["First Year", "Second Year", "Third Year", "Fourth Year"];

export const YearProvider = ({ children }) => {
    const [years, setYears] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const API_URL = "https://campusbeacon.onrender.com/api";

    // Fetch all years
    const fetchYears = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/years`);
            setYears(res.data.data);
        } catch (error) {
            console.error("Error fetching years", error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    // Create a new year
    const createYear = async (year_name, branch_id) => {
        if (!YEAR_NAMES.includes(year_name)) {
            console.error("Invalid year name");
            return;
        }
        try {
            const res = await axios.post(`${API_URL}/years`, { year_name, branch_id });
            setYears([...years, res.data.data]);
        } catch (error) {
            console.error("Error creating year", error);
            setError(error);
        }
    };

    // Edit a year
    const editYear = async (id, year_name, branch_id) => {
        if (year_name && !YEAR_NAMES.includes(year_name)) {
            console.error("Invalid year name");
            return;
        }
        try {
            const res = await axios.put(`${API_URL}/years/${id}`, { year_name, branch_id });
            setYears(years.map(year => year.id === id ? res.data.data : year));
        } catch (error) {
            console.error("Error updating year", error);
            setError(error);
        }
    };

    // Delete a year
    const deleteYear = async (id) => {
        try {
            await axios.delete(`${API_URL}/years/${id}`);
            setYears(years.filter(year => year.id !== id));
        } catch (error) {
            console.error("Error deleting year", error);
            setError(error);
        }
    };

    useEffect(() => {
        fetchYears();
    }, []);

    return (
        <YearContext.Provider value={{ years, loading, error, createYear, editYear, deleteYear, YEAR_NAMES }}>
            {children}
        </YearContext.Provider>
    );
};



const StudyMaterialContext = createContext();

export const useStudyMaterial = () => useContext(StudyMaterialContext);

export const StudyMaterialProvider = ({ children }) => {
    const [studyMaterials, setStudyMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    

    const API_URL = "https://campusbeacon.onrender.com/api";

    // Fetch all study materials
    const fetchStudyMaterials = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/study-materials`);
            setStudyMaterials(res.data.data);
        } catch (error) {
            console.error("Error fetching study materials", error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    // Create a new study material
    const createStudyMaterial = async (formData) => {
        try {
            const res = await axios.post(`${API_URL}/study-materials`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            setStudyMaterials([...studyMaterials, res.data.data]);
        } catch (error) {
            console.error("Error creating study material", error);
            setError(error);
        }
    };

    // Edit a study material
    const updateStudyMaterial = async (material_id, formData) => {
        try {
            const res = await axios.put(`${API_URL}/study-materials/${material_id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            setStudyMaterials(studyMaterials.map(material => material.material_id === material_id ? res.data.data : material));
        } catch (error) {
            console.error("Error updating study material", error);
            setError(error);
        }
    };

    // Delete a study material
    const deleteStudyMaterial = async (material_id) => {
        try {
            await axios.delete(`${API_URL}/study-materials/${material_id}`);
            setStudyMaterials(studyMaterials.filter(material => material.material_id !== material_id));
        } catch (error) {
            console.error("Error deleting study material", error);
            setError(error);
        }
    };

    useEffect(() => {
        fetchStudyMaterials();
    }, []);

    return (
        <StudyMaterialContext.Provider value={{ studyMaterials, loading, error, createStudyMaterial, updateStudyMaterial, deleteStudyMaterial }}>
            {children}
        </StudyMaterialContext.Provider>
    );
};
