/* ============================================================
   KASFILLA - Single Page Application
   Semua data disimpan di localStorage agar persisten
   ============================================================ */

// ===== DATA STORAGE =====
const STORAGE_KEYS = {
  anggota: 'kasfilla_anggota',
  iuran: 'kasfilla_iuran',
  pembayaran: 'kasfilla_pembayaran',
  pengeluaran: 'kasfilla_pengeluaran',
  tunggakan: 'kasfilla_tunggakan'
};

// Data default
const DEFAULT_ANGGOTA = [
  { id: 1, nama: "Andi Pratama", nim: "2501001", status: "Aktif" },
  { id: 2, nama: "Budi Santoso", nim: "2501002", status: "Aktif" },
  { id: 3, nama: "Citra Lestari", nim: "2501003", status: "Aktif" },
  { id: 4, nama: "Dewi Anggraini", nim: "2501004", status: "Aktif" },
  { id: 5, nama: "Eka Putri", nim: "2501005", status: "Aktif" }
];

const DEFAULT_IURAN = [
  { no: 1, jenis: "Iuran Bulanan", nominal: 50000, periode: "Tiap bulan" },
  { no: 2, jenis: "Iuran Kegiatan", nominal: 25000, periode: "Tiap kegiatan" },
  { no: 3, jenis: "Denda Keterlambatan", nominal: 10000, periode: "Sekali" }
];

const DEFAULT_PEMBAYARAN = [
  { id: 1, tanggal: '2026-10-09', anggota: 'Andi Pratama', jenisIuran: 'Iuran Bulanan', nominal: 50000 },
  { id: 2, tanggal: '2026-10-07', anggota: 'Budi Santoso', jenisIuran: 'Iuran Bulanan', nominal: 50000 }
];

const DEFAULT_PENGELUARAN = [
  { id: 1, tanggal: '2026-10-09', keperluan: 'Konsumsi acara', nominal: 150000, keterangan: 'Snack rapat kelas' },
  { id: 2, tanggal: '2026-10-07', keperluan: 'Alat tulis', nominal: 45000, keterangan: 'Spidol dan kertas' },
  { id: 3, tanggal: '2026-10-03', keperluan: 'Kebersihan Kelas', nominal: 80000, keterangan: 'Sapu dan pel' },
  { id: 4, tanggal: '2026-09-28', keperluan: 'Konsumsi acara', nominal: 100000, keterangan: 'Acara kumpul kelas' },
  { id: 5, tanggal: '2026-09-25', keperluan: 'Fotokopi', nominal: 75000, keterangan: 'Materi praktikum' }
];

const DEFAULT_TUNGGAKAN = [
  { anggota: "Budi Santoso", jenisIuran: "Iuran Bulanan", periode: "Agu-Okt 2026", nominal: 150000 },
  { anggota: "Citra Lestari", jenisIuran: "Iuran Bulanan", periode: "Sep-Okt 2026", nominal: 100000 },
  { anggota: "Eka Putri", jenisIuran: "Iuran Bulanan", periode: "Okt 2026", nominal: 50000 }
];

// Helper localStorage
function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) { localStorage.setItem(key, JSON.stringify(fallback)); return fallback; }
    return JSON.parse(raw);
  } catch { return fallback; }
}
function save(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Inisialisasi data
let dataAnggota = load(STORAGE_KEYS.anggota, DEFAULT_ANGGOTA);
let dataIuran = load(STORAGE_KEYS.iuran, DEFAULT_IURAN);
let dataPembayaran = load(STORAGE_KEYS.pembayaran, DEFAULT_PEMBAYARAN);
let dataPengeluaran = load(STORAGE_KEYS.pengeluaran, DEFAULT_PENGELUARAN);
let dataTunggakan = load(STORAGE_KEYS.tunggakan, DEFAULT_TUNGGAKAN);

// Helper format
function formatRupiah(angka) {
  return 'Rp ' + Number(angka).toLocaleString('id-ID');
}
function formatTanggal(iso) {
  if (!iso) return '-';
  const parts = iso.split('-');
  if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
  return iso;
}
function esc(s) {
  return String(s).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// ===== NAVIGASI SPA =====
const mainContent = document.getElementById('main-content');
const navItems = document.querySelectorAll('.nav-item');

navItems.forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    navItems.forEach(n => n.classList.remove('active'));
    item.classList.add('active');
    const page = item.dataset.page;
    renderPage(page);
  });
});

function renderPage(page) {
  switch (page) {
    case 'dashboard': renderDashboardPage(); break;
    case 'anggota': renderAnggotaPage(); break;
    case 'iuran': renderIuranPage(); break;
    case 'pembayaran': renderPembayaranPage(); break;
    case 'pengeluaran': renderPengeluaranPage(); break;
    case 'laporan': renderLaporanPage(); break;
  }
}

// ============================================================
// DASHBOARD
// ============================================================
function renderDashboardPage() {
  const totalPemasukan = dataPembayaran.reduce((s, p) => s + Number(p.nominal), 0);
  const totalPengeluaran = dataPengeluaran.reduce((s, p) => s + Number(p.nominal), 0);
  const totalTunggakan = dataTunggakan.reduce((s, t) => s + Number(t.nominal), 0);
  const saldoKas = totalPemasukan - totalPengeluaran;

  mainContent.innerHTML = `
    <h1 class="page-title">DASHBOARD</h1>
    <section class="summary-cards">
      <div class="card">
        <span class="card-title">Saldo Kas</span>
        <span class="card-value black">${formatRupiah(saldoKas)}</span>
      </div>
      <div class="card">
        <span class="card-title">Total Pemasukan</span>
        <span class="card-value green">${formatRupiah(totalPemasukan)}</span>
      </div>
      <div class="card">
        <span class="card-title">Total Pengeluaran</span>
        <span class="card-value orange">${formatRupiah(totalPengeluaran)}</span>
      </div>
      <div class="card">
        <span class="card-title">Total Tunggakan</span>
        <span class="card-value brown">${formatRupiah(totalTunggakan)}</span>
      </div>
    </section>
    <section class="table-container">
      <h2 class="table-title">Daftar Tunggakan</h2>
      <table class="data-table">
        <thead>
          <tr>
            <th>ANGGOTA</th>
            <th>JENIS IURAN</th>
            <th>PERIODE</th>
            <th class="text-right">NOMINAL</th>
          </tr>
        </thead>
        <tbody>
          ${dataTunggakan.length === 0 ? '<tr><td colspan="4" class="empty">Tidak ada tunggakan</td></tr>' :
            dataTunggakan.map(t => `
              <tr>
                <td>${esc(t.anggota)}</td>
                <td>${esc(t.jenisIuran)}</td>
                <td>${esc(t.periode)}</td>
                <td class="text-right">${formatRupiah(t.nominal)}</td>
              </tr>
            `).join('')}
        </tbody>
      </table>
    </section>
  `;
}

// ============================================================
// ANGGOTA
// ============================================================
function renderAnggotaPage() {
  mainContent.innerHTML = `
    <div class="top-header">
      <h1 class="page-title" style="margin-bottom:0;">ANGGOTA</h1>
      <button class="btn-top-add" id="btn-top-tambah">Tambah Anggota</button>
    </div>
    <div class="anggota-layout">
      <section class="table-container flex-table">
        <h2 class="table-title">Daftar Anggota</h2>
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 50px;">NO</th>
              <th>NAMA</th>
              <th>NIM</th>
              <th>STATUS</th>
              <th class="text-center">AKSI</th>
            </tr>
          </thead>
          <tbody id="anggota-tbody"></tbody>
        </table>
      </section>
      <section class="form-card">
        <h3 class="form-title">Tambah / Edit Anggota</h3>
        <form id="form-anggota">
          <input type="hidden" id="anggota-id" value="">
          <div class="form-group">
            <label for="nama">NAMA</label>
            <input type="text" id="nama" placeholder="Masukan Nama Anda" required>
          </div>
          <div class="form-group">
            <label for="nim">NIM</label>
            <input type="text" id="nim" placeholder="Masukan Nim Anda" required>
          </div>
          <div class="form-group">
            <label for="status">STATUS</label>
            <select id="status">
              <option value="Aktif">Aktif</option>
              <option value="Non-Aktif">Non-Aktif</option>
            </select>
          </div>
          <button type="submit" class="btn-simpan">Simpan</button>
        </form>
      </section>
    </div>
  `;

  const tbody = document.getElementById('anggota-tbody');
  const form = document.getElementById('form-anggota');
  const inputId = document.getElementById('anggota-id');
  const inputNama = document.getElementById('nama');
  const inputNim = document.getElementById('nim');
  const inputStatus = document.getElementById('status');

  function renderTable() {
    tbody.innerHTML = '';
    dataAnggota.forEach((item, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${esc(item.nama)}</td>
        <td>${esc(item.nim)}</td>
        <td>${esc(item.status)}</td>
        <td class="text-center">
          <button class="action-btn" data-edit="${item.id}">Edit</button> |
          <button class="action-btn" data-hapus="${item.id}">Hapus</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  }

  function resetForm() {
    inputId.value = '';
    inputNama.value = '';
    inputNim.value = '';
    inputStatus.value = 'Aktif';
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = inputId.value;
    const nama = inputNama.value.trim();
    const nim = inputNim.value.trim();
    const status = inputStatus.value;

    if (id) {
      const index = dataAnggota.findIndex(a => a.id == id);
      if (index !== -1) dataAnggota[index] = { id: Number(id), nama, nim, status };
    } else {
      const newId = dataAnggota.length > 0 ? Math.max(...dataAnggota.map(a => a.id)) + 1 : 1;
      dataAnggota.push({ id: newId, nama, nim, status });
    }
    save(STORAGE_KEYS.anggota, dataAnggota);
    renderTable();
    resetForm();
  });

  tbody.addEventListener('click', (e) => {
    const editBtn = e.target.closest('[data-edit]');
    const delBtn = e.target.closest('[data-hapus]');

    if (editBtn) {
      const id = Number(editBtn.dataset.edit);
      const anggota = dataAnggota.find(a => a.id === id);
      if (anggota) {
        inputId.value = anggota.id;
        inputNama.value = anggota.nama;
        inputNim.value = anggota.nim;
        inputStatus.value = anggota.status;
        inputNama.focus();
      }
    }
    if (delBtn) {
      const id = Number(delBtn.dataset.hapus);
      if (confirm('Apakah Anda yakin ingin menghapus anggota ini?')) {
        dataAnggota = dataAnggota.filter(a => a.id !== id);
        save(STORAGE_KEYS.anggota, dataAnggota);
        renderTable();
        resetForm();
      }
    }
  });

  document.getElementById('btn-top-tambah').addEventListener('click', () => {
    resetForm();
    inputNama.focus();
  });

  renderTable();
}

// ============================================================
// IURAN
// ============================================================
function renderIuranPage() {
  mainContent.innerHTML = `
    <h1 class="page-title">IURAN</h1>
    <div class="card-section">
      <h2 class="section-title">Daftar Jenis Iuran</h2>
      <div class="table-container" style="padding:0;box-shadow:none;">
        <table>
          <thead>
            <tr>
              <th style="width: 50px;">NO</th>
              <th>Jenis Iuran</th>
              <th>Nominal</th>
              <th>Periode</th>
              <th style="width: 120px;">Aksi</th>
            </tr>
          </thead>
          <tbody id="iuran-tbody"></tbody>
        </table>
      </div>
    </div>
  `;

  const tbody = document.getElementById('iuran-tbody');

  function renderTable() {
    tbody.innerHTML = '';
    dataIuran.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${item.no}</td>
        <td>${esc(item.jenis)}</td>
        <td>${formatRupiah(item.nominal)}</td>
        <td>${esc(item.periode)}</td>
        <td>
          <button class="btn-action" data-edit="${item.no}">Edit</button> |
          <button class="btn-action" data-hapus="${item.no}">Hapus</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  tbody.addEventListener('click', (e) => {
    const editBtn = e.target.closest('[data-edit]');
    const delBtn = e.target.closest('[data-hapus]');

    if (editBtn) {
      const no = Number(editBtn.dataset.edit);
      const item = dataIuran.find(i => i.no === no);
      if (!item) return;
      const jenis = prompt('Jenis Iuran:', item.jenis);
      if (jenis === null) return;
      const nominal = prompt('Nominal (angka):', item.nominal);
      if (nominal === null) return;
      const periode = prompt('Periode:', item.periode);
      if (periode === null) return;
      item.jenis = jenis.trim();
      item.nominal = Number(nominal) || 0;
      item.periode = periode.trim();
      save(STORAGE_KEYS.iuran, dataIuran);
      renderTable();
    }
    if (delBtn) {
      const no = Number(delBtn.dataset.hapus);
      if (confirm('Apakah Anda yakin ingin menghapus data nomor ' + no + '?')) {
        dataIuran = dataIuran.filter(i => i.no !== no);
        save(STORAGE_KEYS.iuran, dataIuran);
        renderTable();
      }
    }
  });

  renderTable();
}

// ============================================================
// PEMBAYARAN
// ============================================================
function renderPembayaranPage() {
  const iuranOptions = dataIuran.map(i =>
    `<option value="${esc(i.jenis)}" data-nominal="${i.nominal}">${esc(i.jenis)}</option>`
  ).join('');

  const anggotaOptions = dataAnggota.map(a =>
    `<option value="${esc(a.nama)}">${esc(a.nama)}</option>`
  ).join('');

  mainContent.innerHTML = `
    <h1 class="page-title">PEMBAYARAN</h1>
    <div class="card-section">
      <div class="section-title">Catatan Pembayaran</div>
      <form id="pembayaran-form" class="form-grid">
        <div class="form-group">
          <label>Anggota*</label>
          <select id="pilih-anggota" class="form-control" required>
            <option value="" disabled selected>Pilih anggota</option>
            ${anggotaOptions}
          </select>
        </div>
        <div class="form-group">
          <label>Jenis iuran*</label>
          <select id="pilih-iuran" class="form-control" required>
            <option value="" disabled selected>Pilih iuran</option>
            ${iuranOptions}
          </select>
        </div>
        <div class="form-group">
          <label>Nominal (RP)*</label>
          <input type="text" id="input-nominal-bayar" class="form-control" placeholder="Otomatis dari iuran" readonly required>
        </div>
        <div class="form-group">
          <label>Tanggal*</label>
          <input type="date" id="input-tanggal-bayar" class="form-control" required>
        </div>
        <button type="submit" class="btn-simpan">Simpan</button>
      </form>
    </div>
    <div class="card-section">
      <div class="section-title">Riwayat Pembayaran</div>
      <table>
        <thead>
          <tr>
            <th style="width: 25%;">Tanggal</th>
            <th style="width: 25%;">Anggota</th>
            <th style="width: 30%;">Jenis Iuran</th>
            <th style="width: 20%;">Nominal</th>
          </tr>
        </thead>
        <tbody id="riwayat-tbody"></tbody>
      </table>
    </div>
  `;

  const form = document.getElementById('pembayaran-form');
  const selectAnggota = document.getElementById('pilih-anggota');
  const selectIuran = document.getElementById('pilih-iuran');
  const inputNominal = document.getElementById('input-nominal-bayar');
  const inputTanggal = document.getElementById('input-tanggal-bayar');
  const tbody = document.getElementById('riwayat-tbody');

  // Set tanggal default hari ini
  const today = new Date();
  inputTanggal.value = today.toISOString().slice(0, 10);

  selectIuran.addEventListener('change', () => {
    const opt = selectIuran.selectedOptions[0];
    if (opt && opt.dataset.nominal) {
      inputNominal.value = formatRupiah(opt.dataset.nominal);
    } else {
      inputNominal.value = '';
    }
  });

  function renderRiwayat() {
    tbody.innerHTML = '';
    const sorted = [...dataPembayaran].sort((a, b) => (b.tanggal || '').localeCompare(a.tanggal || ''));
    if (sorted.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" class="empty">Belum ada riwayat pembayaran</td></tr>';
      return;
    }
    sorted.forEach(p => {
      tbody.innerHTML += `
        <tr>
          <td>${formatTanggal(p.tanggal)}</td>
          <td>${esc(p.anggota)}</td>
          <td>${esc(p.jenisIuran)}</td>
          <td>${formatRupiah(p.nominal)}</td>
        </tr>`;
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const anggota = selectAnggota.value;
    const jenisIuran = selectIuran.value;
    const opt = selectIuran.selectedOptions[0];
    const nominal = opt ? Number(opt.dataset.nominal) : 0;
    const tanggal = inputTanggal.value;

    if (!anggota || !jenisIuran || !nominal || !tanggal) {
      alert('Lengkapi semua data terlebih dahulu.');
      return;
    }

    const newId = dataPembayaran.length > 0
      ? Math.max(...dataPembayaran.map(p => p.id)) + 1 : 1;

    dataPembayaran.push({ id: newId, tanggal, anggota, jenisIuran, nominal });
    save(STORAGE_KEYS.pembayaran, dataPembayaran);

    form.reset();
    inputNominal.value = '';
    inputTanggal.value = today.toISOString().slice(0, 10);
    renderRiwayat();
  });

  renderRiwayat();
}

// ============================================================
// PENGELUARAN
// ============================================================
function renderPengeluaranPage() {
  mainContent.innerHTML = `
    <h1 class="page-title">PENGELUARAN</h1>
    <div class="card-section">
      <div class="section-title">Form Pengeluaran</div>
      <form id="pengeluaran-form" class="form-grid">
        <input type="hidden" id="edit-index" value="-1">
        <div class="form-group">
          <label>Tanggal*</label>
          <input type="date" id="input-tanggal-keluar" class="form-control" required>
        </div>
        <div class="form-group">
          <label>Keperluan*</label>
          <input type="text" id="input-keperluan" class="form-control" placeholder="Contoh: konsumsi acara" required>
        </div>
        <div class="form-group">
          <label>Nominal (RP)*</label>
          <input type="number" id="input-nominal-keluar" class="form-control" placeholder="Masukkan nominal" min="1" required>
        </div>
        <div class="form-group">
          <label>Keterangan</label>
          <input type="text" id="input-keterangan" class="form-control" placeholder="Opsional">
        </div>
        <button type="submit" class="btn-simpan">Simpan</button>
      </form>
    </div>
    <div class="card-section">
      <div class="section-title">Daftar Pengeluaran</div>
      <table>
        <thead>
          <tr>
            <th style="width: 18%;">Tanggal</th>
            <th style="width: 25%;">Keperluan</th>
            <th style="width: 20%;">Nominal</th>
            <th style="width: 22%;">Keterangan</th>
            <th style="width: 15%;">Aksi</th>
          </tr>
        </thead>
        <tbody id="pengeluaran-tbody"></tbody>
      </table>
    </div>
  `;

  const form = document.getElementById('pengeluaran-form');
  const inputTanggal = document.getElementById('input-tanggal-keluar');
  const inputKeperluan = document.getElementById('input-keperluan');
  const inputNominal = document.getElementById('input-nominal-keluar');
  const inputKeterangan = document.getElementById('input-keterangan');
  const editIndexInput = document.getElementById('edit-index');
  const tbody = document.getElementById('pengeluaran-tbody');

  const today = new Date();
  inputTanggal.value = today.toISOString().slice(0, 10);

  function renderTable() {
    tbody.innerHTML = '';
    if (dataPengeluaran.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="empty">Belum ada pengeluaran</td></tr>';
      return;
    }
    const sorted = [...dataPengeluaran].sort((a, b) => (b.tanggal || '').localeCompare(a.tanggal || ''));
    sorted.forEach((item) => {
      const realIndex = dataPengeluaran.indexOf(item);
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${formatTanggal(item.tanggal)}</td>
        <td>${esc(item.keperluan)}</td>
        <td>${formatRupiah(item.nominal)}</td>
        <td>${esc(item.keterangan) || '-'}</td>
        <td class="action-links">
          <span data-edit="${realIndex}">Edit</span> |
          <span data-hapus="${realIndex}">Hapus</span>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const index = parseInt(editIndexInput.value);
    const tanggal = inputTanggal.value;
    const keperluan = inputKeperluan.value.trim();
    const nominal = Number(inputNominal.value);
    const keterangan = inputKeterangan.value.trim() || '-';

    if (!tanggal || !keperluan || !nominal || nominal <= 0) {
      alert('Lengkapi tanggal, keperluan, dan nominal yang lebih dari 0.');
      return;
    }

    if (index === -1) {
      const newId = dataPengeluaran.length > 0
        ? Math.max(...dataPengeluaran.map(p => p.id || 0)) + 1 : 1;
      dataPengeluaran.push({ id: newId, tanggal, keperluan, nominal, keterangan });
    } else {
      dataPengeluaran[index] = { ...dataPengeluaran[index], tanggal, keperluan, nominal, keterangan };
    }

    save(STORAGE_KEYS.pengeluaran, dataPengeluaran);
    resetForm();
    renderTable();
  });

  function resetForm() {
    editIndexInput.value = '-1';
    form.reset();
    inputTanggal.value = today.toISOString().slice(0, 10);
  }

  tbody.addEventListener('click', (e) => {
    const editBtn = e.target.closest('[data-edit]');
    const delBtn = e.target.closest('[data-hapus]');

    if (editBtn) {
      const index = Number(editBtn.dataset.edit);
      const item = dataPengeluaran[index];
      if (!item) return;
      editIndexInput.value = index;
      inputTanggal.value = item.tanggal;
      inputKeperluan.value = item.keperluan;
      inputNominal.value = item.nominal;
      inputKeterangan.value = item.keterangan === '-' ? '' : item.keterangan;
      inputKeperluan.focus();
    }

    if (delBtn) {
      const index = Number(delBtn.dataset.hapus);
      if (confirm(`Yakin ingin menghapus pengeluaran "${dataPengeluaran[index].keperluan}"?`)) {
        dataPengeluaran.splice(index, 1);
        save(STORAGE_KEYS.pengeluaran, dataPengeluaran);
        renderTable();
        resetForm();
      }
    }
  });

  renderTable();
}

// ============================================================
// LAPORAN
// ============================================================
function renderLaporanPage() {
  // Gabungkan rekap per anggota
  const rekapMap = {};
  dataAnggota.forEach(a => {
    rekapMap[a.nama.toLowerCase()] = { anggota: a.nama, dibayar: 0, tunggakan: 0 };
  });

  dataPembayaran.forEach(p => {
    const key = p.anggota.toLowerCase();
    if (!rekapMap[key]) rekapMap[key] = { anggota: p.anggota, dibayar: 0, tunggakan: 0 };
    rekapMap[key].dibayar += Number(p.nominal);
  });

  dataTunggakan.forEach(t => {
    const key = t.anggota.toLowerCase();
    if (!rekapMap[key]) rekapMap[key] = { anggota: t.anggota, dibayar: 0, tunggakan: 0 };
    rekapMap[key].tunggakan += Number(t.nominal);
  });

  const rekapData = Object.values(rekapMap);

  const totalPemasukan = dataPembayaran.reduce((s, p) => s + Number(p.nominal), 0);
  const totalPengeluaran = dataPengeluaran.reduce((s, p) => s + Number(p.nominal), 0);
  const saldo = totalPemasukan - totalPengeluaran;

  const anggotaOptions = rekapData.map(r =>
    `<option value="${esc(r.anggota)}">${esc(r.anggota)}</option>`
  ).join('');

  mainContent.innerHTML = `
    <h1 class="page-title">LAPORAN</h1>
    <div class="card-section">
      <div class="section-title">Filter Laporan</div>
      <form id="filter-form" class="filter-grid">
        <div class="form-group">
          <label>Periode mulai</label>
          <input type="date" id="periode-mulai" class="form-control">
        </div>
        <div class="form-group">
          <label>Periode selesai</label>
          <input type="date" id="periode-selesai" class="form-control">
        </div>
        <div class="form-group">
          <label>Anggota</label>
          <select id="select-anggota-laporan" class="form-control">
            <option value="Semua anggota">Semua anggota</option>
            ${anggotaOptions}
          </select>
        </div>
        <button type="submit" class="btn-tampilkan">Tampilkan</button>
      </form>
    </div>

    <div class="summary-cards-container">
      <div class="summary-card">
        <span class="summary-card-title">Pemasukan</span>
        <span class="summary-card-value text-green" id="val-pemasukan">${formatRupiah(totalPemasukan)}</span>
      </div>
      <div class="summary-card">
        <span class="summary-card-title">Pengeluaran</span>
        <span class="summary-card-value text-brown" id="val-pengeluaran">${formatRupiah(totalPengeluaran)}</span>
      </div>
      <div class="summary-card">
        <span class="summary-card-title">Saldo</span>
        <span class="summary-card-value text-black" id="val-saldo">${formatRupiah(saldo)}</span>
      </div>
    </div>

    <div class="card-section">
      <div class="section-title">Rekap per anggota</div>
      <table>
        <thead>
          <tr>
            <th style="width: 40%;">Anggota</th>
            <th style="width: 35%;">Total dibayar</th>
            <th style="width: 25%;">Tunggakan</th>
          </tr>
        </thead>
        <tbody id="rekap-tbody"></tbody>
      </table>
    </div>
  `;

  const filterForm = document.getElementById('filter-form');
  const selectAnggota = document.getElementById('select-anggota-laporan');
  const tbody = document.getElementById('rekap-tbody');

  function renderRekap(data) {
    tbody.innerHTML = '';
    let grandTotalDibayar = 0;
    let grandTotalTunggakan = 0;

    data.forEach(item => {
      grandTotalDibayar += item.dibayar;
      grandTotalTunggakan += item.tunggakan;
      tbody.innerHTML += `
        <tr>
          <td>${esc(item.anggota)}</td>
          <td>${formatRupiah(item.dibayar)}</td>
          <td>${formatRupiah(item.tunggakan)}</td>
        </tr>`;
    });

    tbody.innerHTML += `
      <tr style="font-weight:bold;">
        <td>Total</td>
        <td>${formatRupiah(grandTotalDibayar)}</td>
        <td>${formatRupiah(grandTotalTunggakan)}</td>
      </tr>`;
  }

  filterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const selected = selectAnggota.value;
    if (selected === 'Semua anggota') {
      renderRekap(rekapData);
    } else {
      renderRekap(rekapData.filter(item => item.anggota.toLowerCase() === selected.toLowerCase()));
    }
  });

  renderRekap(rekapData);
}

// ===== INISIALISASI =====
document.addEventListener('DOMContentLoaded', () => {
  renderPage('dashboard');
});