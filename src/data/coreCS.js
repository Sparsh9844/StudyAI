// Core CS — Interview Preparation Sheet
// Three subjects: DBMS, Operating System, Computer Networks
//
// Each topic has:
//   id       — stable slug for localStorage checkbox
//   title    — topic name
//   desc     — one-line description of what it covers
//   links    — array of { label, url } pointing to well-known sources
//   tags     — difficulty / category tags

export const coreSubjects = [
  // ══════════════════════════════════════════════════
  // DBMS
  // ══════════════════════════════════════════════════
  {
    id: 'dbms',
    name: 'Database Management Systems',
    short: 'DBMS',
    color: 'from-blue-500 to-cyan-500',
    border: 'border-blue-500/20',
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    description: 'Fundamental database concepts asked in every service & product-based company interview.',
    topics: [
      {
        id: 'dbms-intro',
        title: 'Introduction to DBMS — Architecture & Types',
        desc: '3-tier architecture, DBMS vs file system, types (relational, NoSQL, hierarchical).',
        tags: ['Basics'],
        links: [
          { label: 'GFG — DBMS Introduction', url: 'https://www.geeksforgeeks.org/introduction-to-dbms/' },
          { label: 'JavaTpoint — DBMS Basics', url: 'https://www.javatpoint.com/dbms-tutorial' },
          { label: 'Tutorialspoint — DBMS Overview', url: 'https://www.tutorialspoint.com/dbms/dbms_overview.htm' },
        ],
      },
      {
        id: 'dbms-er',
        title: 'ER Model & ER Diagrams',
        desc: 'Entity, attributes, relationships, cardinality, weak entities, specialisation, generalisation.',
        tags: ['Basics'],
        links: [
          { label: 'GFG — ER Model', url: 'https://www.geeksforgeeks.org/introduction-of-er-model/' },
          { label: 'JavaTpoint — ER Diagram', url: 'https://www.javatpoint.com/dbms-er-model-concept' },
          { label: 'Tutorialspoint — ER Model', url: 'https://www.tutorialspoint.com/dbms/er_model.htm' },
        ],
      },
      {
        id: 'dbms-relational',
        title: 'Relational Model & Relational Algebra',
        desc: 'Tables, tuples, domains, keys, relational algebra operations (σ, π, ⋈, ∪, −).',
        tags: ['Core'],
        links: [
          { label: 'GFG — Relational Model', url: 'https://www.geeksforgeeks.org/relational-model-in-dbms/' },
          { label: 'GFG — Relational Algebra', url: 'https://www.geeksforgeeks.org/introduction-of-relational-algebra-in-dbms/' },
          { label: 'Tutorialspoint — Relational Model', url: 'https://www.tutorialspoint.com/dbms/relational_data_model.htm' },
        ],
      },
      {
        id: 'dbms-keys',
        title: 'Keys — Primary, Foreign, Candidate, Super, Composite',
        desc: 'Every type of key, their constraints and real-world use cases.',
        tags: ['Core'],
        links: [
          { label: 'GFG — Types of Keys in DBMS', url: 'https://www.geeksforgeeks.org/types-of-keys-in-relational-model-candidate-super-primary-alternate-and-foreign/' },
          { label: 'JavaTpoint — Keys in DBMS', url: 'https://www.javatpoint.com/dbms-keys' },
          { label: 'Scaler — DBMS Keys', url: 'https://www.scaler.com/topics/dbms/types-of-keys-in-dbms/' },
        ],
      },
      {
        id: 'dbms-normalization',
        title: 'Normalization — 1NF, 2NF, 3NF, BCNF',
        desc: 'Functional dependencies, anomalies, and step-by-step normalization up to BCNF.',
        tags: ['Core', 'Important'],
        links: [
          { label: 'GFG — Normalization', url: 'https://www.geeksforgeeks.org/introduction-of-database-normalization/' },
          { label: 'JavaTpoint — Normal Forms', url: 'https://www.javatpoint.com/dbms-normalization' },
          { label: 'Tutorialspoint — Normalization', url: 'https://www.tutorialspoint.com/dbms/database_normalization.htm' },
          { label: 'Scaler — BCNF', url: 'https://www.scaler.com/topics/dbms/bcnf-in-dbms/' },
        ],
      },
      {
        id: 'dbms-sql-basics',
        title: 'SQL — DDL, DML, DCL, TCL',
        desc: 'CREATE, ALTER, DROP, INSERT, UPDATE, DELETE, COMMIT, ROLLBACK, GRANT, REVOKE.',
        tags: ['Core', 'Must Know'],
        links: [
          { label: 'GFG — SQL DDL, DML, DCL, TCL', url: 'https://www.geeksforgeeks.org/sql-ddl-dml-dcl-tcl-commands/' },
          { label: 'JavaTpoint — SQL Commands', url: 'https://www.javatpoint.com/sql-commands' },
          { label: 'W3Schools — SQL Tutorial', url: 'https://www.w3schools.com/sql/' },
        ],
      },
      {
        id: 'dbms-sql-joins',
        title: 'SQL Joins — INNER, LEFT, RIGHT, FULL, CROSS, SELF',
        desc: 'All join types with diagrams and query examples.',
        tags: ['Core', 'Must Know'],
        links: [
          { label: 'GFG — SQL Joins', url: 'https://www.geeksforgeeks.org/sql-join-set-1-inner-left-right-and-full-joins/' },
          { label: 'W3Schools — SQL Joins', url: 'https://www.w3schools.com/sql/sql_join.asp' },
          { label: 'JavaTpoint — SQL Joins', url: 'https://www.javatpoint.com/sql-join' },
        ],
      },
      {
        id: 'dbms-indexes',
        title: 'Indexing — Types, B-Trees, Clustered vs Non-Clustered',
        desc: 'Primary, secondary, dense/sparse indexes; B-tree and B+ tree structures.',
        tags: ['Core'],
        links: [
          { label: 'GFG — Indexing in DBMS', url: 'https://www.geeksforgeeks.org/indexing-in-databases/' },
          { label: 'GFG — B+ Tree', url: 'https://www.geeksforgeeks.org/introduction-of-b-tree/' },
          { label: 'JavaTpoint — Indexing', url: 'https://www.javatpoint.com/indexing-in-dbms' },
        ],
      },
      {
        id: 'dbms-transactions',
        title: 'Transactions & ACID Properties',
        desc: 'Atomicity, Consistency, Isolation, Durability; transaction states and lifecycle.',
        tags: ['Core', 'Important'],
        links: [
          { label: 'GFG — Transactions in DBMS', url: 'https://www.geeksforgeeks.org/transaction-management/' },
          { label: 'GFG — ACID Properties', url: 'https://www.geeksforgeeks.org/acid-properties-in-dbms/' },
          { label: 'JavaTpoint — Transactions', url: 'https://www.javatpoint.com/dbms-transaction-management' },
        ],
      },
      {
        id: 'dbms-concurrency',
        title: 'Concurrency Control — Locks, 2PL, Deadlocks',
        desc: 'Shared/exclusive locks, two-phase locking protocol, deadlock prevention and detection.',
        tags: ['Advanced'],
        links: [
          { label: 'GFG — Concurrency Control', url: 'https://www.geeksforgeeks.org/concurrency-control-in-dbms/' },
          { label: 'GFG — Two Phase Locking', url: 'https://www.geeksforgeeks.org/two-phase-locking-protocol/' },
          { label: 'JavaTpoint — Concurrency Control', url: 'https://www.javatpoint.com/dbms-concurrency-control' },
        ],
      },
      {
        id: 'dbms-recovery',
        title: 'Database Recovery — Log-Based, Checkpointing',
        desc: 'Failure types, log-based recovery, undo/redo operations, checkpointing.',
        tags: ['Advanced'],
        links: [
          { label: 'GFG — Database Recovery', url: 'https://www.geeksforgeeks.org/log-based-recovery-in-dbms/' },
          { label: 'JavaTpoint — Recovery in DBMS', url: 'https://www.javatpoint.com/dbms-recovery' },
          { label: 'Tutorialspoint — Recovery', url: 'https://www.tutorialspoint.com/dbms/dbms_data_recovery.htm' },
        ],
      },
      {
        id: 'dbms-views-stored-proc',
        title: 'Views, Stored Procedures & Triggers',
        desc: 'Virtual tables, stored procedures, functions, and triggers in SQL.',
        tags: ['Core'],
        links: [
          { label: 'GFG — Views in SQL', url: 'https://www.geeksforgeeks.org/sql-views/' },
          { label: 'GFG — Stored Procedures', url: 'https://www.geeksforgeeks.org/what-is-stored-procedures-in-sql/' },
          { label: 'W3Schools — SQL Views', url: 'https://www.w3schools.com/sql/sql_view.asp' },
        ],
      },
      {
        id: 'dbms-nosql',
        title: 'NoSQL Databases — Types & Use Cases',
        desc: 'Document, key-value, column-family, graph databases; CAP theorem; MongoDB basics.',
        tags: ['Advanced'],
        links: [
          { label: 'GFG — NoSQL Databases', url: 'https://www.geeksforgeeks.org/introduction-to-nosql/' },
          { label: 'GFG — CAP Theorem', url: 'https://www.geeksforgeeks.org/the-cap-theorem-in-dbms/' },
          { label: 'JavaTpoint — NoSQL vs SQL', url: 'https://www.javatpoint.com/sql-vs-nosql' },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════
  // OPERATING SYSTEM
  // ══════════════════════════════════════════════════
  {
    id: 'os',
    name: 'Operating Systems',
    short: 'OS',
    color: 'from-violet-500 to-purple-600',
    border: 'border-violet-500/20',
    bg: 'bg-violet-500/10',
    text: 'text-violet-400',
    description: 'Core OS concepts — processes, memory, scheduling, and file systems — asked in every technical interview.',
    topics: [
      {
        id: 'os-intro',
        title: 'Introduction — Functions, Types & Structure of OS',
        desc: 'Batch, multiprogramming, time-sharing, real-time OS; kernel, shell, system calls.',
        tags: ['Basics'],
        links: [
          { label: 'GFG — Introduction to OS', url: 'https://www.geeksforgeeks.org/introduction-of-operating-system/' },
          { label: 'JavaTpoint — OS Tutorial', url: 'https://www.javatpoint.com/os-tutorial' },
          { label: 'Tutorialspoint — OS Overview', url: 'https://www.tutorialspoint.com/operating_system/os_overview.htm' },
        ],
      },
      {
        id: 'os-process',
        title: 'Process & Process Lifecycle',
        desc: 'Process states (new, ready, running, blocked, terminated), PCB, process vs thread.',
        tags: ['Core', 'Must Know'],
        links: [
          { label: 'GFG — Process in OS', url: 'https://www.geeksforgeeks.org/process-in-operating-system/' },
          { label: 'GFG — Process States', url: 'https://www.geeksforgeeks.org/states-of-a-process-in-operating-systems/' },
          { label: 'JavaTpoint — Process Management', url: 'https://www.javatpoint.com/os-process-management' },
        ],
      },
      {
        id: 'os-threads',
        title: 'Threads & Multithreading',
        desc: 'User vs kernel threads, multithreading models, benefits and thread libraries.',
        tags: ['Core'],
        links: [
          { label: 'GFG — Threads in OS', url: 'https://www.geeksforgeeks.org/thread-in-operating-system/' },
          { label: 'GFG — User vs Kernel Threads', url: 'https://www.geeksforgeeks.org/difference-between-user-level-thread-and-kernel-level-thread/' },
          { label: 'JavaTpoint — Multithreading', url: 'https://www.javatpoint.com/multithreading-in-operating-system' },
        ],
      },
      {
        id: 'os-scheduling',
        title: 'CPU Scheduling Algorithms',
        desc: 'FCFS, SJF, SRTF, Round Robin, Priority scheduling — Gantt charts, waiting time, turnaround time.',
        tags: ['Core', 'Important'],
        links: [
          { label: 'GFG — CPU Scheduling', url: 'https://www.geeksforgeeks.org/cpu-scheduling-in-operating-systems/' },
          { label: 'GFG — Round Robin', url: 'https://www.geeksforgeeks.org/round-robin-scheduling-in-os/' },
          { label: 'JavaTpoint — Scheduling Algorithms', url: 'https://www.javatpoint.com/os-process-scheduling-algorithms' },
          { label: 'Tutorialspoint — CPU Scheduling', url: 'https://www.tutorialspoint.com/operating_system/os_process_scheduling_algorithms.htm' },
        ],
      },
      {
        id: 'os-synchronization',
        title: 'Process Synchronization — Mutex, Semaphore, Monitors',
        desc: 'Race condition, critical section, Peterson\'s solution, binary & counting semaphores.',
        tags: ['Core', 'Important'],
        links: [
          { label: 'GFG — Process Synchronization', url: 'https://www.geeksforgeeks.org/process-synchronization-in-operating-system/' },
          { label: 'GFG — Semaphores', url: 'https://www.geeksforgeeks.org/semaphores-in-process-synchronization/' },
          { label: 'JavaTpoint — Synchronization', url: 'https://www.javatpoint.com/os-process-synchronization' },
        ],
      },
      {
        id: 'os-deadlock',
        title: 'Deadlock — Conditions, Prevention, Detection, Recovery',
        desc: 'Four necessary conditions, Banker\'s algorithm, resource allocation graph.',
        tags: ['Core', 'Must Know'],
        links: [
          { label: 'GFG — Deadlock in OS', url: 'https://www.geeksforgeeks.org/introduction-of-deadlock-in-operating-system/' },
          { label: "GFG — Banker's Algorithm", url: 'https://www.geeksforgeeks.org/bankers-algorithm-in-operating-system/' },
          { label: 'JavaTpoint — Deadlock', url: 'https://www.javatpoint.com/os-deadlocks-introduction' },
        ],
      },
      {
        id: 'os-memory-management',
        title: 'Memory Management — Paging, Segmentation, Fragmentation',
        desc: 'Contiguous allocation, paging, page tables, segmentation, internal vs external fragmentation.',
        tags: ['Core', 'Important'],
        links: [
          { label: 'GFG — Memory Management', url: 'https://www.geeksforgeeks.org/memory-management-in-os/' },
          { label: 'GFG — Paging in OS', url: 'https://www.geeksforgeeks.org/paging-in-operating-system/' },
          { label: 'JavaTpoint — Memory Management', url: 'https://www.javatpoint.com/os-memory-management' },
          { label: 'Tutorialspoint — Paging', url: 'https://www.tutorialspoint.com/operating_system/os_paging.htm' },
        ],
      },
      {
        id: 'os-virtual-memory',
        title: 'Virtual Memory & Demand Paging',
        desc: 'Virtual address space, demand paging, page fault handling, thrashing.',
        tags: ['Core'],
        links: [
          { label: 'GFG — Virtual Memory', url: 'https://www.geeksforgeeks.org/virtual-memory-in-operating-system/' },
          { label: 'GFG — Demand Paging', url: 'https://www.geeksforgeeks.org/page-replacement-algorithms-in-operating-systems/' },
          { label: 'JavaTpoint — Virtual Memory', url: 'https://www.javatpoint.com/os-virtual-memory' },
        ],
      },
      {
        id: 'os-page-replacement',
        title: 'Page Replacement Algorithms — FIFO, LRU, Optimal',
        desc: 'FIFO, LRU, Optimal (OPT), LFU — Belady\'s anomaly, frame allocation.',
        tags: ['Core', 'Important'],
        links: [
          { label: 'GFG — Page Replacement', url: 'https://www.geeksforgeeks.org/page-replacement-algorithms-in-operating-systems/' },
          { label: "GFG — Belady's Anomaly", url: 'https://www.geeksforgeeks.org/beladys-anomaly-in-page-replacement-algorithms/' },
          { label: 'JavaTpoint — Page Replacement', url: 'https://www.javatpoint.com/os-page-replacement-algorithm' },
        ],
      },
      {
        id: 'os-file-system',
        title: 'File System — Structure, Allocation Methods',
        desc: 'Contiguous, linked, indexed allocation; directory structures, file system interface.',
        tags: ['Core'],
        links: [
          { label: 'GFG — File System', url: 'https://www.geeksforgeeks.org/file-systems-in-operating-system/' },
          { label: 'GFG — File Allocation Methods', url: 'https://www.geeksforgeeks.org/file-allocation-methods/' },
          { label: 'JavaTpoint — File System', url: 'https://www.javatpoint.com/os-file-system' },
        ],
      },
      {
        id: 'os-disk-scheduling',
        title: 'Disk Scheduling — FCFS, SSTF, SCAN, C-SCAN',
        desc: 'Disk structure, access time, FCFS, SSTF, SCAN, LOOK, C-SCAN algorithms.',
        tags: ['Advanced'],
        links: [
          { label: 'GFG — Disk Scheduling', url: 'https://www.geeksforgeeks.org/disk-scheduling-algorithms/' },
          { label: 'GFG — SSTF Algorithm', url: 'https://www.geeksforgeeks.org/sstf-disk-scheduling-algorithms/' },
          { label: 'JavaTpoint — Disk Scheduling', url: 'https://www.javatpoint.com/os-disk-management' },
        ],
      },
      {
        id: 'os-ipc',
        title: 'Inter-Process Communication (IPC)',
        desc: 'Pipes, message queues, shared memory, sockets, signals.',
        tags: ['Advanced'],
        links: [
          { label: 'GFG — IPC in OS', url: 'https://www.geeksforgeeks.org/inter-process-communication-ipc/' },
          { label: 'JavaTpoint — IPC', url: 'https://www.javatpoint.com/ipc-in-operating-system' },
          { label: 'Tutorialspoint — IPC', url: 'https://www.tutorialspoint.com/inter_process_communication/inter_process_communication_overview.htm' },
        ],
      },
      {
        id: 'os-system-calls',
        title: 'System Calls & Kernel Mode vs User Mode',
        desc: 'Dual-mode operation, types of system calls, context switching.',
        tags: ['Basics', 'Must Know'],
        links: [
          { label: 'GFG — System Calls', url: 'https://www.geeksforgeeks.org/introduction-of-system-call/' },
          { label: 'GFG — Kernel Mode vs User Mode', url: 'https://www.geeksforgeeks.org/kernel-mode-vs-user-mode/' },
          { label: 'JavaTpoint — System Calls', url: 'https://www.javatpoint.com/system-call-in-operating-system' },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════
  // COMPUTER NETWORKS
  // ══════════════════════════════════════════════════
  {
    id: 'cn',
    name: 'Computer Networks',
    short: 'CN',
    color: 'from-emerald-500 to-teal-500',
    border: 'border-emerald-500/20',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    description: 'Networking fundamentals — protocols, OSI model, routing, and security — essential for backend and systems interviews.',
    topics: [
      {
        id: 'cn-intro',
        title: 'Introduction — Types of Networks & Topologies',
        desc: 'LAN, WAN, MAN, PAN; bus, star, ring, mesh, hybrid topologies; transmission media.',
        tags: ['Basics'],
        links: [
          { label: 'GFG — Computer Network Introduction', url: 'https://www.geeksforgeeks.org/basics-computer-networking/' },
          { label: 'JavaTpoint — CN Tutorial', url: 'https://www.javatpoint.com/computer-network-tutorial' },
          { label: 'Tutorialspoint — CN Overview', url: 'https://www.tutorialspoint.com/data_communication_computer_network/index.htm' },
        ],
      },
      {
        id: 'cn-osi',
        title: 'OSI Model — 7 Layers & Their Functions',
        desc: 'Physical, Data Link, Network, Transport, Session, Presentation, Application layers.',
        tags: ['Core', 'Must Know'],
        links: [
          { label: 'GFG — OSI Model', url: 'https://www.geeksforgeeks.org/open-systems-interconnection-model-osi/' },
          { label: 'JavaTpoint — OSI Model', url: 'https://www.javatpoint.com/osi-model' },
          { label: 'Tutorialspoint — OSI Model', url: 'https://www.tutorialspoint.com/the-osi-model-and-its-layers' },
        ],
      },
      {
        id: 'cn-tcpip',
        title: 'TCP/IP Model & Protocol Stack',
        desc: '4-layer TCP/IP model, comparison with OSI, protocol stack overview.',
        tags: ['Core', 'Must Know'],
        links: [
          { label: 'GFG — TCP/IP Model', url: 'https://www.geeksforgeeks.org/tcp-ip-model/' },
          { label: 'JavaTpoint — TCP/IP', url: 'https://www.javatpoint.com/tcp-ip' },
          { label: 'W3Schools — TCP/IP', url: 'https://www.w3schools.com/whatis/whatis_tcp.asp' },
        ],
      },
      {
        id: 'cn-ip',
        title: 'IP Addressing — IPv4, IPv6, Subnetting, CIDR',
        desc: 'IPv4 classes, private/public IPs, subnet mask, CIDR notation, IPv6 features.',
        tags: ['Core', 'Important'],
        links: [
          { label: 'GFG — IP Addressing', url: 'https://www.geeksforgeeks.org/introduction-of-classful-ip-addressing/' },
          { label: 'GFG — Subnetting', url: 'https://www.geeksforgeeks.org/introduction-to-subnetting/' },
          { label: 'JavaTpoint — IP Address', url: 'https://www.javatpoint.com/ip' },
        ],
      },
      {
        id: 'cn-tcp-udp',
        title: 'TCP vs UDP — Connection, Reliability, Use Cases',
        desc: 'TCP 3-way handshake, flow control, congestion control; UDP characteristics.',
        tags: ['Core', 'Must Know'],
        links: [
          { label: 'GFG — TCP vs UDP', url: 'https://www.geeksforgeeks.org/differences-between-tcp-and-udp/' },
          { label: 'GFG — TCP 3-Way Handshake', url: 'https://www.geeksforgeeks.org/tcp-3-way-handshake-process/' },
          { label: 'JavaTpoint — TCP vs UDP', url: 'https://www.javatpoint.com/tcp-vs-udp' },
        ],
      },
      {
        id: 'cn-http-https',
        title: 'HTTP, HTTPS & REST',
        desc: 'HTTP methods (GET, POST, PUT, DELETE), status codes, HTTPS/TLS, REST principles.',
        tags: ['Core', 'Must Know'],
        links: [
          { label: 'GFG — HTTP vs HTTPS', url: 'https://www.geeksforgeeks.org/difference-between-http-and-https/' },
          { label: 'GFG — HTTP Methods', url: 'https://www.geeksforgeeks.org/http-request-methods/' },
          { label: 'W3Schools — HTTP', url: 'https://www.w3schools.com/whatis/whatis_http.asp' },
        ],
      },
      {
        id: 'cn-dns',
        title: 'DNS, DHCP & ARP',
        desc: 'Domain Name System resolution, DHCP IP leasing, ARP cache and operation.',
        tags: ['Core'],
        links: [
          { label: 'GFG — DNS in Computer Network', url: 'https://www.geeksforgeeks.org/domain-name-system-dns-in-application-layer/' },
          { label: 'GFG — DHCP', url: 'https://www.geeksforgeeks.org/dynamic-host-configuration-protocol-dhcp/' },
          { label: 'GFG — ARP', url: 'https://www.geeksforgeeks.org/arp-reverse-arp/' },
        ],
      },
      {
        id: 'cn-routing',
        title: 'Routing Algorithms — Dijkstra, Bellman-Ford, OSPF, BGP',
        desc: 'Static vs dynamic routing, distance vector (RIP), link state (OSPF), path vector (BGP).',
        tags: ['Core', 'Important'],
        links: [
          { label: 'GFG — Routing Algorithms', url: 'https://www.geeksforgeeks.org/classification-of-routing-algorithms/' },
          { label: 'GFG — OSPF Protocol', url: 'https://www.geeksforgeeks.org/open-shortest-path-first-ospf-protocol/' },
          { label: 'JavaTpoint — Routing', url: 'https://www.javatpoint.com/computer-network-routing-algorithm' },
        ],
      },
      {
        id: 'cn-datalink',
        title: 'Data Link Layer — MAC, CSMA/CD, Error Detection',
        desc: 'Framing, MAC addresses, CSMA/CD, CSMA/CA, CRC, parity, Hamming code.',
        tags: ['Core'],
        links: [
          { label: 'GFG — Data Link Layer', url: 'https://www.geeksforgeeks.org/data-link-layer/' },
          { label: 'GFG — Error Detection', url: 'https://www.geeksforgeeks.org/error-detection-in-computer-networks/' },
          { label: 'JavaTpoint — Data Link Layer', url: 'https://www.javatpoint.com/data-link-layer' },
        ],
      },
      {
        id: 'cn-flow-control',
        title: 'Flow Control & Congestion Control',
        desc: 'Stop-and-Wait, Go-Back-N, Selective Repeat; TCP congestion control (slow start, AIMD).',
        tags: ['Advanced'],
        links: [
          { label: 'GFG — Flow Control', url: 'https://www.geeksforgeeks.org/flow-control-in-data-link-layer/' },
          { label: 'GFG — Congestion Control', url: 'https://www.geeksforgeeks.org/congestion-control-in-computer-networks/' },
          { label: 'JavaTpoint — Flow Control', url: 'https://www.javatpoint.com/flow-control-in-computer-network' },
        ],
      },
      {
        id: 'cn-security',
        title: 'Network Security — SSL/TLS, Firewalls, Cryptography Basics',
        desc: 'Symmetric vs asymmetric encryption, SSL/TLS handshake, firewalls, VPN, common attacks.',
        tags: ['Advanced', 'Important'],
        links: [
          { label: 'GFG — Network Security', url: 'https://www.geeksforgeeks.org/network-security/' },
          { label: 'GFG — SSL/TLS', url: 'https://www.geeksforgeeks.org/secure-socket-layer-ssl/' },
          { label: 'JavaTpoint — Network Security', url: 'https://www.javatpoint.com/network-security' },
        ],
      },
      {
        id: 'cn-socket',
        title: 'Socket Programming & Ports',
        desc: 'Sockets, well-known ports (80, 443, 22, 3306, 5432), client-server communication.',
        tags: ['Core'],
        links: [
          { label: 'GFG — Socket Programming', url: 'https://www.geeksforgeeks.org/socket-programming-cc/' },
          { label: 'GFG — Well Known Ports', url: 'https://www.geeksforgeeks.org/list-of-well-known-ports-0-1023/' },
          { label: 'JavaTpoint — Sockets', url: 'https://www.javatpoint.com/socket-programming' },
        ],
      },
      {
        id: 'cn-wireless',
        title: 'Wireless Networks — WiFi, Bluetooth, 4G/5G',
        desc: 'IEEE 802.11 standards, WiFi generations, Bluetooth, cellular network generations.',
        tags: ['Advanced'],
        links: [
          { label: 'GFG — Wireless Networks', url: 'https://www.geeksforgeeks.org/wireless-networks/' },
          { label: 'GFG — WiFi Standards', url: 'https://www.geeksforgeeks.org/ieee-802-11-mac-frame/' },
          { label: 'JavaTpoint — Wireless Network', url: 'https://www.javatpoint.com/wireless-networks' },
        ],
      },
    ],
  },
]

// Flat list for global stats
export const allCoreTopics = coreSubjects.flatMap(s =>
  s.topics.map(t => ({ ...t, subjectId: s.id, subjectName: s.name }))
)

export const tagVariant = {
  'Basics':     'default',
  'Core':       'info',
  'Must Know':  'warning',
  'Important':  'warning',
  'Advanced':   'danger',
}
