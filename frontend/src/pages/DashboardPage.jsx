import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'
import styles from './DashboardPage.module.css'

const statusClass = { 'New': 'badge-new', 'Active': 'badge-active', 'Matched': 'badge-matched', 'On Hold': 'badge-onhold', 'Closed': 'badge-closed' }

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')

  useEffect(() => {
    api.get('/api/customers').then(({ data }) => {
      setCustomers(data)
      setLoading(false)
    })
  }, [])

  const filtered = customers.filter(c => {
    const name = `${c.firstName} ${c.lastName}`.toLowerCase()
    const matchSearch = name.includes(search.toLowerCase()) || c.city?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'All' || c.statusTag === filterStatus
    return matchSearch && matchStatus
  })

  const stats = {
    total: customers.length,
    active: customers.filter(c => c.statusTag === 'Active').length,
    matched: customers.filter(c => c.statusTag === 'Matched').length,
    new: customers.filter(c => c.statusTag === 'New').length,
  }

  return (
    <div className={styles.page}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>💑 TDC</div>
        <nav className={styles.nav}>
          <a className={`${styles.navItem} ${styles.active}`}>👥 Customers</a>
          <a className={styles.navItem}>📊 Analytics</a>
          <a className={styles.navItem}>⚙️ Settings</a>
        </nav>
        <div className={styles.sidebarUser}>
          <div className={styles.avatar}>{user?.name?.[0]}</div>
          <div>
            <p className={styles.userName}>{user?.name}</p>
            <p className={styles.userRole}>Matchmaker</p>
          </div>
          <button className={styles.logoutBtn} onClick={logout} title="Logout">⎋</button>
        </div>
      </aside>

      {/* Main */}
      <main className={styles.main}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.heading}>My Customers</h1>
            <p className={styles.subheading}>Manage and track your matchmaking clients</p>
          </div>
        </div>

        {/* Stats */}
        <div className={styles.statsRow}>
          {[
            { label: 'Total', value: stats.total, icon: '👥', color: '#7c3aed' },
            { label: 'Active', value: stats.active, icon: '✅', color: '#10b981' },
            { label: 'Matched', value: stats.matched, icon: '💍', color: '#e91e8c' },
            { label: 'New', value: stats.new, icon: '🆕', color: '#f59e0b' },
          ].map(s => (
            <div key={s.label} className={styles.statCard}>
              <span className={styles.statIcon}>{s.icon}</span>
              <div>
                <p className={styles.statValue} style={{ color: s.color }}>{s.value}</p>
                <p className={styles.statLabel}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className={styles.filters}>
          <input
            className={styles.search}
            placeholder="🔍  Search by name or city..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className={styles.statusFilters}>
            {['All', 'New', 'Active', 'Matched', 'On Hold', 'Closed'].map(s => (
              <button
                key={s}
                className={`${styles.filterBtn} ${filterStatus === s ? styles.filterActive : ''}`}
                onClick={() => setFilterStatus(s)}
              >{s}</button>
            ))}
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className={styles.loader}>Loading customers...</div>
        ) : filtered.length === 0 ? (
          <div className={styles.empty}>No customers found.</div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>City</th>
                  <th>Marital Status</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c._id} className={styles.row} onClick={() => navigate(`/customer/${c._id}`)}>
                    <td className={styles.nameCell}>
                      <div className={styles.avatarSmall}>{c.firstName[0]}{c.lastName[0]}</div>
                      <span>{c.firstName} {c.lastName}</span>
                    </td>
                    <td>{c.age}</td>
                    <td>{c.gender}</td>
                    <td>{c.city}</td>
                    <td>{c.maritalStatus}</td>
                    <td><span className={`badge ${statusClass[c.statusTag]}`}>{c.statusTag}</span></td>
                    <td className={styles.arrowCell}>→</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}