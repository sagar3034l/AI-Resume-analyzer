import "../style/home.scss";
import { useInterview } from "../hooks/useInterview";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";

const Home = () => {
  const {loading, generateReport,reports, getAllReports} = useInterview();
  const [jobDescription, setJobDescription] = useState("");
  const [selfdescription, setselfDescription] = useState("");
  const resumeInputRef = useRef()

  const navigate = useNavigate();

  const handleGenerateReport = async () => {
        const resumeFile = resumeInputRef.current.files[0]
        const data = await generateReport({ jobDescription, selfDescription: selfdescription, resumeFile })
        navigate(`/interview/${data._id}`)
  }

  useEffect(() => {
    getAllReports();
  }, [getAllReports]);

  return (  
    <main className="home">

      <div className="page-header">
        <h1 className="main-title">
          Create Your Custom <span>Interview Plan</span>
        </h1>

        <p>
          Let our AI analyze the job requirements and your unique profile to
          build a winning strategy.
        </p>
      </div>

      <div className="interview-container">

        {/* LEFT SIDE */}
        <div className="panel">

          <div className="panel-header">
            <h3>Target Job Description</h3>
            <span className="tag required">REQUIRED</span>
          </div>

          <textarea
            placeholder="Paste the full job description here..."
            className="textarea"
            value={jobDescription}
            onChange={(e)=>{setJobDescription(e.target.value)}}
          />

          <div className="char-count">0 / 5000 chars</div>
        </div>

        {/* RIGHT SIDE */}
        <div className="panel">

          <div className="panel-header">
            <h3>Your Profile</h3>
          </div>

          <label className="upload-box">
            <input ref={resumeInputRef} type="file" id="resume" name="resume" hidden accept=".pdf,.docx" />
            <div className="upload-icon">☁</div>
            <p>Click to upload or drag & drop</p>
            <small>PDF or DOCX (Max 5MB)</small>
          </label>

          <div className="divider">OR</div>

          <label>Quick Self-Description</label>

          <textarea
            className="textarea small"
            placeholder="Briefly describe your experience, key skills, and years of experience..."
            value={selfdescription}
            onChange={(e)=>{setselfDescription(e.target.value)}}
          />

          <div className="info-box">
            Either a <b>Resume</b> or a <b>Self Description</b> is required to
            generate a personalized plan.
          </div>
        </div>
      </div>

      <div className="bottom-bar">

        <p>AI-Powered Strategy Generation · Approx 30s</p>

        <button 
        onClick={handleGenerateReport}
        className="generate-btn">
          ✦ Generate My Interview Strategy
        </button>

      </div>

      <section className="recent-reports">
        <h2>My Recent Interview Plans</h2>
        {reports.length === 0 ? (
          <p className="reports-empty">No reports yet. Generate your first plan above.</p>
        ) : (
          <ul className="reports-list">
            {reports.map((report) => (
              <li
                key={report._id}
                className="report-item"
                onClick={() => navigate(`/interview/${report._id}`)}
              >
                <div className="report-title">{report.title || "Untitled Position"}</div>
                <div className="report-meta">
                  {new Date(report.createdAt).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

    </main>
  );
};

export default Home;
