import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../utils/api'
import styles from './CustomerDetailPage.module.css'

const statusClass = { 'New': 'badge-new', 'Active': 'badge-active', 'Matched': 'badge-matched', 'On Hold': 'badge-onhold', 'Closed': 'badge-closed' }

export default function CustomerDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [customer, setCustomer] = useState(null)
  const [matches, setMatches] = useState([])
  const [loadingMatches, setLoadingMatches] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const [noteText, setNoteText] = useState('')
  const [toast, setToast] = useState(null)
  const [aiIntro, setAiIntro] = useState({})
  const [loadingAI, setLoadingAI] = useState({})
  const [sentMatches, setSentMatches] = useState({})

  useEffect(() => {
    api.get(`/api/customers/${id}`).then(({ data }) => setCustomer(data))
  }, [id])

  const loadMatches = () => {
    setActiveTab('matches')
    if (matches.length > 0) return
    setLoadingMatches(true)
    api.get(`/api/matches/${id}`).then(({ data }) => {
      setMatches(data)
      setLoadingMatches(false)
    })
  }

  const addNote = async () => {
    if (!noteText.trim()) return
    const { data } = await api.post(`/api/customers/${id}/notes`, { text: noteText })
    setCustomer(data)
    setNoteText('')
    showToast('Note saved!')
  }

  const updateStatus = async (statusTag) => {
    const { data } = await api.patch(`/api/customers/${id}/status`, { statusTag })
    setCustomer(data)
    showToast(`Status updated to ${statusTag}`)
  }

  const sendMatch = async (matchId, matchName) => {
    await api.post(`/api/matches/${id}/send`, { matchId })
    setSentMatches(p => ({ ...p, [matchId]: true }))
    showToast(`💌 Match sent to ${customer.firstName} — introducing ${matchName}!`)
  }

  const getAIIntro = async (matchId) => {
    setLoadingAI(p => ({ ...p, [matchId]: true }))
    try {
      const { data } = await api.post(`/api/matches/${id}/ai-intro`, { matchId })
      setAiIntro(p => ({ ...p, [matchId]: data.intro }))
    } finally {
      setLoadingAI(p => ({ ...p, [matchId]: false }))
    }
  }

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3500)
  }

  const Field = ({ label, value }) => value ? (
    <div className={styles.field}>
      <span className={styles.fieldLabel}>{label}</span>
      <span className={styles.fieldValue}>{value}</span>
    </div>
  ) : null

  if (!customer) return <div className={styles.loading}>Loading...</div>

  const age = customer.age
  const name = `${customer.firstName} ${customer.lastName}`

  return (
    <div className={styles.page}>
      {toast && <div className={styles.toast}>{toast}</div>}

      <button className={styles.back} onClick={() => navigate('/dashboard')}>← Back to Dashboard</button>

      {/* Profile Header */}
      <div className={styles.profileHeader}>
        <div className={styles.profileAvatar}>{customer.firstName[0]}{customer.lastName[0]}</div>
        <div className={styles.profileInfo}>
          <h1 className={styles.profileName}>{name}</h1>
          <p className={styles.profileSub}>{customer.designation} · {customer.city} · {age} yrs</p>
          <div className={styles.profileBadges}>
            <span className={`badge ${statusClass[customer.statusTag]}`}>{customer.statusTag}</span>
            <span className={styles.genderTag}>{customer.gender}</span>
            <span className={styles.genderTag}>{customer.religion}</span>
          </div>
        </div>
        <div className={styles.statusChanger}>
          <label>Update Status</label>
          <select value={customer.statusTag} onChange={e => updateStatus(e.target.value)}>
            {['New', 'Active', 'Matched', 'On Hold', 'Closed'].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        {['profile', 'matches', 'notes'].map(t => (
          <button key={t} className={`${styles.tab} ${activeTab === t ? styles.tabActive : ''}`}
            onClick={() => t === 'matches' ? loadMatches() : setActiveTab(t)}>
            {t === 'profile' ? '👤 Profile' : t === 'matches' ? '💍 Matches' : '📝 Notes'}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className={styles.grid}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Personal Info</h2>
            <Field label="Full Name" value={name} />
            <Field label="Gender" value={customer.gender} />
            <Field label="Date of Birth" value={customer.dateOfBirth ? new Date(customer.dateOfBirth).toLocaleDateString('en-IN') : ''} />
            <Field label="Age" value={`${age} years`} />
            <Field label="City" value={customer.city} />
            <Field label="Country" value={customer.country} />
            <Field label="Height" value={customer.height ? `${customer.height} cm` : ''} />
            <Field label="Marital Status" value={customer.maritalStatus} />
            <Field label="Religion" value={customer.religion} />
            <Field label="Caste" value={customer.caste} />
            <Field label="Languages" value={customer.languagesKnown?.join(', ')} />
            <Field label="Siblings" value={customer.siblings?.toString()} />
          </div>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Professional Info</h2>
            <Field label="Email" value={customer.email} />
            <Field label="Phone" value={customer.phone} />
            <Field label="Company" value={customer.currentCompany} />
            <Field label="Designation" value={customer.designation} />
            <Field label="Annual Income" value={customer.income ? `₹${customer.income} LPA` : ''} />
            <Field label="College" value={customer.undergraduateCollege} />
            <Field label="Degree" value={customer.degree} />
          </div>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Preferences</h2>
            <Field label="Want Kids" value={customer.wantKids} />
            <Field label="Open to Relocate" value={customer.openToRelocate} />
            <Field label="Open to Pets" value={customer.openToPets} />
            <Field label="Family Values" value={customer.familyValues} />
            <Field label="Diet" value={customer.diet} />
          </div>
        </div>
      )}

      {/* Matches Tab */}
      {activeTab === 'matches' && (
        <div>
          {loadingMatches ? (
            <div className={styles.loading}>Finding best matches using AI...</div>
          ) : (
            <div className={styles.matchList}>
              {matches.map(({ candidate, score, reasons, label }) => (
                <div key={candidate._id} className={styles.matchCard}>
                  <div className={styles.matchHeader}>
                    <div className={styles.matchAvatar}>{candidate.firstName[0]}{candidate.lastName[0]}
                    </div>
                    <div className={styles.matchInfo}>
                      <h3>{candidate.firstName} {candidate.lastName}</h3>
                      <p>{candidate.designation} · {candidate.city} · {candidate.age} yrs</p>
                    </div>
                    <div className={styles.matchScore}>
                      <div className={styles.scoreCircle} style={{ '--pct': `${score}%` }}>{score}</div>
                      <p className={styles.matchLabel}>{label}</p>
                    </div>
                  </div>
                  <div className={styles.reasons}>
                    {reasons.map((r, i) => <span key={i} className={styles.reason}>✓ {r}</span>)}
                  </div>
                  {aiIntro[candidate._id] && (
                    <div className={styles.aiIntro}>
                      <p className={styles.aiLabel}> AI-Generated Intro</p>
                      <p>{aiIntro[candidate._id]}</p>
                    </div>
                  )}
                  <div className={styles.matchActions}>
                    <button className={styles.aiBtn} onClick={() => getAIIntro(candidate._id)} disabled={loadingAI[candidate._id]}>
                      {loadingAI[candidate._id] ? 'Generating...' : 'AI Intro'}
                    </button>
                    <button
                      className={`${styles.sendBtn} ${sentMatches[candidate._id] ? styles.sentBtn : ''}`}
                      onClick={() => sendMatch(candidate._id, `${candidate.firstName} ${candidate.lastName}`)}
                      disabled={sentMatches[candidate._id]}
                    >
                      {sentMatches[candidate._id] ? 'Match Sent' : ' Send Match'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Notes Tab */}
      {activeTab === 'notes' && (
        <div className={styles.notesSection}>
          <div className={styles.noteInput}>
            <textarea
              placeholder="Add a note from meeting or call..."
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              rows={3}
            />
            <button className={styles.noteBtn} onClick={addNote}>Save Note</button>
          </div>
          <div className={styles.notesList}>
            {customer.notes?.length === 0 && <p className={styles.emptyNotes}>No notes yet. Add your first note above.</p>}
            {[...customer.notes].reverse().map((n, i) => (
              <div key={i} className={styles.noteItem}>
                <p>{n.text}</p>
                <span className={styles.noteDate}>{new Date(n.createdAt).toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}