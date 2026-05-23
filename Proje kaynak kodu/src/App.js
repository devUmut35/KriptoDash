import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.scss';
import Chart from 'chart.js/auto';

const tumCoinler = [
  { id: 'btc', ad: 'Bitcoin', sembol: 'BTC', fiyat: 63200, degisim: '+2.4%', hacim: '$32B', yon: 'up', logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/bitcoin/info/logo.png' },
  { id: 'eth', ad: 'Ethereum', sembol: 'ETH', fiyat: 3410, degisim: '-1.2%', hacim: '$15B', yon: 'down', logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png' },
  { id: 'bnb', ad: 'BNB', sembol: 'BNB', fiyat: 590, degisim: '+0.8%', hacim: '$2B', yon: 'up', logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/info/logo.png' },
  { id: 'sol', ad: 'Solana', sembol: 'SOL', fiyat: 145, degisim: '+5.1%', hacim: '$4B', yon: 'up', logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png' },
  { id: 'xrp', ad: 'Ripple', sembol: 'XRP', fiyat: 0.52, degisim: '-0.4%', hacim: '$1B', yon: 'down', logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ripple/info/logo.png' },
  { id: 'ada', ad: 'Cardano', sembol: 'ADA', fiyat: 0.45, degisim: '+1.1%', hacim: '$800M', yon: 'up', logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/cardano/info/logo.png' },
  { id: 'avax', ad: 'Avalanche', sembol: 'AVAX', fiyat: 45, degisim: '-2.3%', hacim: '$500M', yon: 'down', logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/avalanchec/info/logo.png' },
  { id: 'doge', ad: 'Dogecoin', sembol: 'DOGE', fiyat: 0.15, degisim: '+8.4%', hacim: '$1.2B', yon: 'up', logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/doge/info/logo.png' },
  { id: 'dot', ad: 'Polkadot', sembol: 'DOT', fiyat: 7.2, degisim: '+0.5%', hacim: '$300M', yon: 'up', logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polkadot/info/logo.png' },
  { id: 'matic', ad: 'Polygon', sembol: 'MATIC', fiyat: 0.7, degisim: '-1.8%', hacim: '$250M', yon: 'down', logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png' }
];

const gecmisFiyatUret = (sonFiyat, adet) => {
  let fiyatlar = new Array(adet);
  fiyatlar[adet - 1] = sonFiyat;
  let mevcutFiyat = sonFiyat;
  for (let i = adet - 2; i >= 0; i--) {
    let degisim = mevcutFiyat * (Math.random() * 0.04 - 0.02);
    mevcutFiyat -= degisim;
    fiyatlar[i] = mevcutFiyat;
  }
  return fiyatlar;
};

const fiyatGecmisi = {};
tumCoinler.forEach(coin => { fiyatGecmisi[coin.sembol] = gecmisFiyatUret(coin.fiyat, 30); });

const sabitRenkler = {
  BTC: '#f59f00', ETH: '#7048e8', BNB: '#f1c40f', SOL: '#20c997',
  XRP: '#3498db', ADA: '#2980b9', AVAX: '#e74c3c', DOGE: '#e67e22',
  DOT: '#e84393', MATIC: '#9b59b6', Nakit: '#2ecc71'
};

function UstKisim({ mevcutMod, modDegistir, bildirimVer, cuzdan }) {
  const loc = useLocation();
  const [menuAcik, setMenuAcik] = useState(false);
  
  let headerBakiye = cuzdan.bakiye;
  Object.keys(cuzdan.varliklar).forEach(sembol => {
    const gnclCoin = tumCoinler.find(c => c.sembol === sembol);
    if(gnclCoin) headerBakiye += (cuzdan.varliklar[sembol] * gnclCoin.fiyat);
  });

  const bgRenk = mevcutMod === 'light-mod' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(18, 18, 18, 0.9)';
  const dropRenk = mevcutMod === 'light-mod' ? '#ffffff' : '#2b2b2b';
  const badgeRenk = mevcutMod === 'light-mod' ? 'bg-light text-dark border' : 'bg-dark text-white border-secondary';
  
  return (
    <header className="p-3 mb-4 d-flex justify-content-between align-items-center border-bottom sticky-top shadow-sm" style={{backdropFilter: 'blur(10px)', backgroundColor: bgRenk, zIndex: 1000}}>
      <div className="d-flex align-items-center gap-3">
        <div className="d-flex align-items-center gap-2">
          <div className="bg-primary text-white rounded d-flex justify-content-center align-items-center" style={{width: '32px', height: '32px'}}>
            <span className="fs-5" style={{lineHeight: 1}}>✦</span>
          </div>
          <span className="h4 m-0 fw-bold text-primary" style={{letterSpacing: '-1px'}}>KriptoDash</span>
        </div>
        <nav className="d-none d-md-flex gap-4 ms-3" aria-label="Ana Menü">
          <Link to="/" className={`text-decoration-none fs-6 ${loc.pathname === '/' ? 'text-primary fw-bold' : 'text-secondary'}`}>Cüzdanım</Link>
          <Link to="/piyasalar" className={`text-decoration-none fs-6 ${loc.pathname === '/piyasalar' ? 'text-primary fw-bold' : 'text-secondary'}`}>Piyasalar</Link>
        </nav>
      </div>

      <div className="d-flex align-items-center gap-3">
        <div className={`badge ${badgeRenk} px-3 py-2 fs-6 fw-normal d-none d-lg-block rounded-pill`}>
          <span className="opacity-75 me-2">Varlık:</span>
          <strong>${headerBakiye.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong>
        </div>

        <button className="btn btn-sm btn-success fw-bold px-3 d-none d-sm-block rounded-pill shadow-sm" aria-label="Para Yatır" onClick={() => bildirimVer("Para yatırma modülü bakımda.", "info")}>
          Para Yatır
        </button>

        <div className="d-flex align-items-center gap-3 ms-1">
          <div className="position-relative" style={{cursor: 'pointer'}} onClick={() => bildirimVer("Yeni bildirim yok.", "info")} aria-label="Bildirimler" role="button" tabIndex="0">
            <span style={{fontSize:'22px'}} aria-hidden="true">🔔</span>
            <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
          </div>
          
          <button className="btn btn-sm btn-outline-secondary rounded-circle d-flex justify-content-center align-items-center" style={{width: '35px', height: '35px'}} aria-label="Tema Değiştir" onClick={modDegistir}>
            {mevcutMod === 'light-mod' ? '🌙' : '☀️'}
          </button>
          
          <div className="position-relative">
            <button 
              className="btn bg-primary text-white rounded-circle d-flex justify-content-center align-items-center fw-bold shadow-sm p-0" 
              style={{width: '38px', height:'38px', fontSize: '1.1rem'}}
              aria-label="Kullanıcı Menüsü"
              onClick={() => setMenuAcik(!menuAcik)}
            >
              U
            </button>
            {menuAcik && (
              <div className="position-absolute end-0 mt-3 shadow rounded border animasyonlu-kart p-0" style={{width: '220px', backgroundColor: dropRenk, zIndex: 1050}}>
                <div className="p-3 border-bottom d-flex align-items-center gap-3">
                  <div className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center fw-bold" style={{width: '40px', height:'40px'}}>U</div>
                  <div>
                    <strong className="d-block m-0">Umut</strong>
                    <small className="text-muted">Premium Üye</small>
                  </div>
                </div>
                <div className="py-2">
                  <div className="px-3 py-2 text-secondary d-flex align-items-center gap-2" style={{cursor:'pointer'}}>⚙️ Ayarlar</div>
                  <div className="px-3 py-2 text-danger d-flex align-items-center gap-2 border-top mt-1 pt-2" style={{cursor:'pointer'}}>🚪 Çıkış Yap</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function MobilAltMenu({ mevcutMod }) {
  const loc = useLocation();
  const bgRenk = mevcutMod === 'light-mod' ? '#ffffff' : '#1e1e1e';
  
  return (
    <nav className="d-md-none position-fixed bottom-0 w-100 d-flex justify-content-around align-items-center border-top shadow-lg" aria-label="Mobil Alt Menü" style={{backgroundColor: bgRenk, height: '65px', zIndex: 1050, paddingBottom: 'env(safe-area-inset-bottom)'}}>
      <Link to="/" className={`text-decoration-none d-flex flex-column align-items-center ${loc.pathname === '/' ? 'text-primary' : 'text-secondary'}`}>
        <span className="fs-4 mb-1" aria-hidden="true" style={{filter: loc.pathname === '/' ? 'none' : 'grayscale(100%)'}}>💼</span>
        <span className="fw-bold" style={{fontSize: '11px'}}>Cüzdan</span>
      </Link>
      <Link to="/piyasalar" className={`text-decoration-none d-flex flex-column align-items-center ${loc.pathname === '/piyasalar' ? 'text-primary' : 'text-secondary'}`}>
        <span className="fs-4 mb-1" aria-hidden="true" style={{filter: loc.pathname === '/piyasalar' ? 'none' : 'grayscale(100%)'}}>📊</span>
        <span className="fw-bold" style={{fontSize: '11px'}}>Piyasalar</span>
      </Link>
    </nav>
  );
}

function BildirimKutusu({ toast, setToast }) {
  if (!toast.acik) return null;
  let bgRenk = toast.tip === 'success' ? 'bg-success' : toast.tip === 'danger' ? 'bg-danger' : 'bg-info text-dark';
  return (
    <div className="position-fixed bottom-0 end-0 p-3" style={{zIndex: 1100, marginBottom: '70px'}}>
      <div className={`toast show align-items-center text-white ${bgRenk} border-0 shadow-lg`} role="alert" aria-live="assertive" aria-atomic="true">
        <div className="d-flex">
          <div className="toast-body fw-bold fs-6">{toast.mesaj}</div>
          <button type="button" className="btn-close btn-close-white me-2 m-auto" aria-label="Kapat" onClick={() => setToast({acik: false, mesaj: '', tip: ''})}></button>
        </div>
      </div>
    </div>
  );
}

function AnaDashboard({ cuzdan, setCuzdan, bildirimVer }) {
  const pastaGrafikRef = useRef(null);
  const pastaGrafikInstance = useRef(null);
  
  const [islemTipi, setIslemTipi] = useState('Al');
  const [seciliCoin, setSeciliCoin] = useState('BTC');
  const [islemTutari, setIslemTutari] = useState('');

  let portfoyDegeri = cuzdan.bakiye;
  Object.keys(cuzdan.varliklar).forEach(sembol => {
    const gnclCoin = tumCoinler.find(c => c.sembol === sembol);
    if(gnclCoin) portfoyDegeri += (cuzdan.varliklar[sembol] * gnclCoin.fiyat);
  });

  useEffect(() => {
    if (pastaGrafikInstance.current) pastaGrafikInstance.current.destroy();
    const ctx = pastaGrafikRef.current.getContext('2d');
    
    const sahipOlunanlar = Object.keys(cuzdan.varliklar).filter(k => cuzdan.varliklar[k] > 0);
    const etiketler = sahipOlunanlar.map(k => tumCoinler.find(c => c.sembol === k)?.ad || k);
    const veriler = sahipOlunanlar.map(k => cuzdan.varliklar[k] * (tumCoinler.find(c => c.sembol === k)?.fiyat || 0));
    const renkler = sahipOlunanlar.map(k => sabitRenkler[k] || '#888');

    if(cuzdan.bakiye > 0) {
      etiketler.push('Nakit (USD)');
      veriler.push(cuzdan.bakiye);
      renkler.push(sabitRenkler['Nakit']);
    }

    pastaGrafikInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: { labels: etiketler, datasets: [{ data: veriler, backgroundColor: renkler, borderWidth: 0 }] },
      options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
    });
    return () => { if(pastaGrafikInstance.current) pastaGrafikInstance.current.destroy(); }
  }, [cuzdan]);

  const islemOnaylaBtn = () => {
    const tutar = parseFloat(islemTutari);
    if (!tutar || tutar <= 0) { bildirimVer("Geçerli bir tutar girin!", "danger"); return; }
    
    const coinBilgisi = tumCoinler.find(c => c.sembol === seciliCoin);
    const alinacakMiktar = tutar / coinBilgisi.fiyat;
    let yeniCuzdan = { ...cuzdan, varliklar: { ...cuzdan.varliklar } };

    if (islemTipi === 'Al') {
      if (yeniCuzdan.bakiye < tutar) { bildirimVer(`Yetersiz bakiye! ($${yeniCuzdan.bakiye.toFixed(2)})`, "danger"); return; }
      yeniCuzdan.bakiye -= tutar;
      yeniCuzdan.varliklar[seciliCoin] = (yeniCuzdan.varliklar[seciliCoin] || 0) + alinacakMiktar;
      bildirimVer(`${tutar}$ değerinde ${seciliCoin} alındı!`, "success");
    } else {
      if ((yeniCuzdan.varliklar[seciliCoin] || 0) < alinacakMiktar) { bildirimVer(`Yetersiz ${seciliCoin}!`, "danger"); return; }
      yeniCuzdan.varliklar[seciliCoin] -= alinacakMiktar;
      yeniCuzdan.bakiye += tutar;
      bildirimVer(`${tutar}$ değerinde ${seciliCoin} satıldı!`, "success");
    }
    setCuzdan(yeniCuzdan); localStorage.setItem('kriptoCuzdan', JSON.stringify(yeniCuzdan)); setIslemTutari('');
  };

  return (
    <div className="fade-in">
      <div className="row g-4">
        <div className="col-lg-8 d-flex flex-column gap-4">
          <div className="bakiye-kutu shadow position-relative overflow-hidden">
            <div style={{position:'absolute', right:'-20px', top:'-20px', opacity:'0.1', fontSize:'150px'}} aria-hidden="true">💰</div>
            <p className="mb-1 opacity-75">Toplam Portföy Değeri</p>
            <h1 className="fw-bold display-4 m-0">${portfoyDegeri.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h1>
            <span className="badge bg-light text-dark fs-6 mt-3 shadow-sm me-2">Nakit: ${cuzdan.bakiye.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
          </div>

          <div>
            <h2 className="h5 mb-3">Sahip Olduğum Varlıklar</h2>
            <div className="row g-3">
              {Object.keys(cuzdan.varliklar).map(sembol => {
                if(cuzdan.varliklar[sembol] <= 0.00001) return null;
                const detay = tumCoinler.find(c => c.sembol === sembol);
                if(!detay) return null;
                return (
                  <div className="col-md-6" key={sembol}>
                    <div className="cuzdan-kart animasyonlu-kart h-100 border-start border-primary border-4">
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <img src={detay.logo} alt="" aria-hidden="true" style={{width:'25px', height:'25px'}} />
                        <h3 className="h5 m-0" style={{color: '#7048e8'}}>{detay.ad} ({sembol})</h3>
                      </div>
                      <p className="fs-3 fw-bold mb-0">{cuzdan.varliklar[sembol].toFixed(4)}</p>
                      <small className="text-muted">Değer: ${(cuzdan.varliklar[sembol] * detay.fiyat).toLocaleString('en-US', {maximumFractionDigits: 2})}</small>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="col-lg-4 d-flex flex-column gap-4">
          <div className="grafik-kutu p-4 rounded shadow-sm text-center">
            <h2 className="h5 mb-4 border-bottom pb-2">Varlık Dağılımı</h2>
            <canvas ref={pastaGrafikRef}></canvas>
          </div>

          <div className="grafik-kutu p-4 rounded shadow-sm flex-grow-1">
            <h2 className="h5 mb-3">Hızlı İşlem</h2>
            <div className="d-flex gap-2 mb-3">
              <button className={`btn w-50 ${islemTipi === 'Al' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setIslemTipi('Al')}>Al</button>
              <button className={`btn w-50 ${islemTipi === 'Sat' ? 'btn-danger' : 'btn-outline-danger'}`} onClick={() => setIslemTipi('Sat')}>Sat</button>
            </div>
            
            <div className="mb-3">
              <label htmlFor="kriptoSec" className="form-label text-muted small fw-bold">Kripto Para</label>
              <div className="input-group shadow-sm">
                <span className="input-group-text bg-primary text-white border-primary border-opacity-50" aria-hidden="true">🪙</span>
                <select 
                  id="kriptoSec"
                  className="form-select border-primary border-opacity-50 fw-bold" 
                  style={{cursor: 'pointer'}} 
                  value={seciliCoin} 
                  onChange={(e) => setSeciliCoin(e.target.value)}
                >
                  {tumCoinler.map(c => <option key={c.sembol} value={c.sembol}>{c.ad} ({c.sembol})</option>)}
                </select>
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="tutarGir" className="form-label text-muted small fw-bold">Tutar (USD)</label>
              <div className="input-group shadow-sm">
                <span className="input-group-text bg-light border-secondary border-opacity-25" aria-hidden="true">$</span>
                <input 
                  id="tutarGir"
                  type="number" 
                  className="form-control border-secondary border-opacity-25" 
                  placeholder="0.00" 
                  value={islemTutari} 
                  onChange={(e) => setIslemTutari(e.target.value)} 
                />
              </div>
            </div>
            
            <button className={`btn w-100 fw-bold shadow-sm ${islemTipi === 'Al' ? 'btn-success' : 'btn-danger'}`} onClick={islemOnaylaBtn}>
              İşlemi Onayla
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MarketVerileri() {
  const [aramaKelimesi, setAramaKelimesi] = useState('');
  const yonlendir = useNavigate();
  
  const cizgiGrafikRef = useRef(null);
  const cizgiGrafikInstance = useRef(null);
  const [grafikCoin, setGrafikCoin] = useState('BTC');

  const filtrelenmisListe = tumCoinler.filter(coin => coin.ad.toLowerCase().includes(aramaKelimesi.toLowerCase()) || coin.sembol.toLowerCase().includes(aramaKelimesi.toLowerCase()));

  useEffect(() => {
    if (cizgiGrafikInstance.current) cizgiGrafikInstance.current.destroy();
    const ctx = cizgiGrafikRef.current.getContext('2d');
    const seciliVeri = fiyatGecmisi[grafikCoin] || fiyatGecmisi['BTC'];
    const gunler = Array.from({length: 30}, (_, i) => i === 0 ? 'Bugün' : `${i} Gün Önce`).reverse();
    const cizgiRengi = seciliVeri[seciliVeri.length-1] >= seciliVeri[0] ? '#20c997' : '#e74c3c';

    cizgiGrafikInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: gunler,
        datasets: [{
          label: `${grafikCoin} Fiyatı`,
          data: seciliVeri,
          borderColor: cizgiRengi,
          backgroundColor: cizgiRengi + '20',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 0
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { x: { display: false }, y: { display: true } }
      }
    });
    return () => { if(cizgiGrafikInstance.current) cizgiGrafikInstance.current.destroy(); }
  }, [grafikCoin]);

  return (
    <div className="fade-in d-flex flex-column gap-4">
      <h1 className="h3 d-block d-md-none fw-bold text-primary mb-0 px-2">Piyasalar</h1>
      
      <div className="grafik-kutu p-4 rounded shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h5 m-0">Piyasa Analizi</h2>
          <select 
            className="form-select w-auto shadow-none" 
            style={{cursor: 'pointer', minWidth: '150px'}} 
            value={grafikCoin} 
            onChange={(e) => setGrafikCoin(e.target.value)}
            aria-label="Analiz edilecek kripto parayı seçin"
          >
            {tumCoinler.map(c => <option key={c.sembol} value={c.sembol}>{c.ad} ({c.sembol})</option>)}
          </select>
        </div>
        <canvas ref={cizgiGrafikRef} style={{maxHeight: '300px'}}></canvas>
      </div>

      <div className="cuzdan-kart p-4 rounded shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <h2 className="h4 m-0">Canlı Piyasa Verileri</h2>
          <input 
            type="text" 
            className="form-control w-auto shadow-sm" 
            style={{minWidth: '250px'}} 
            placeholder="Coin Ara..." 
            value={aramaKelimesi} 
            onChange={(e) => setAramaKelimesi(e.target.value)} 
            aria-label="Kripto Para Ara"
          />
        </div>
        <div className="table-responsive">
          <table className="table table-hover table-borderless mt-3 align-middle">
            <thead className="border-bottom">
              <tr><th>Coin</th><th>Son Fiyat</th><th>24s Değişim</th><th>Piyasa Hacmi</th><th>İşlem</th></tr>
            </thead>
            <tbody>
              {filtrelenmisListe.length > 0 ? (
                filtrelenmisListe.map(coin => (
                  <tr key={coin.id}>
                    <td><div className="d-flex align-items-center gap-2"><img src={coin.logo} alt="" aria-hidden="true" style={{width:'30px', height:'30px'}} /><div><strong>{coin.ad}</strong> <span className="text-muted">({coin.sembol})</span></div></div></td>
                    <td className="fw-bold">${coin.fiyat.toLocaleString('en-US')}</td>
                    <td><span className={`badge bg-opacity-25 ${coin.yon === 'up' ? 'bg-success text-success' : 'bg-danger text-danger'}`}>{coin.degisim}</span></td>
                    <td>{coin.hacim}</td>
                    <td><button className="btn btn-sm btn-outline-primary fw-bold px-3" aria-label={`${coin.ad} Al-Sat Yap`} onClick={() => yonlendir('/')}>Al-Sat</button></td>
                  </tr>
                ))
              ) : (<tr><td colSpan="5" className="text-center py-4 text-muted">Bulunamadı.</td></tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [tema, setTema] = useState('light-mod');
  const [toast, setToast] = useState({acik: false, mesaj: '', tip: ''});
  const [cuzdan, setCuzdan] = useState(() => {
    const kayitli = localStorage.getItem('kriptoCuzdan');
    return kayitli ? JSON.parse(kayitli) : { bakiye: 15000, varliklar: { BTC: 0.1, ETH: 1.5, SOL: 25 } };
  });

  useEffect(() => { document.body.className = tema; }, [tema]);

  const bildirimVer = (mesaj, tip) => {
    setToast({acik: true, mesaj, tip});
    setTimeout(() => setToast({acik: false, mesaj: '', tip: ''}), 3500);
  };

  return (
    <BrowserRouter>
      <BildirimKutusu toast={toast} setToast={setToast} />
      <UstKisim mevcutMod={tema} modDegistir={() => setTema(tema === 'light-mod' ? 'dark-mod' : 'light-mod')} bildirimVer={bildirimVer} cuzdan={cuzdan} />
      <main className="container mb-5 mt-4 min-vh-100" style={{paddingBottom: '80px'}}>
        <Routes>
          <Route path="/" element={<AnaDashboard cuzdan={cuzdan} setCuzdan={setCuzdan} bildirimVer={bildirimVer} />} />
          <Route path="/piyasalar" element={<MarketVerileri />} />
        </Routes>
      </main>
      <MobilAltMenu mevcutMod={tema} />
      <footer className="p-4 text-center mt-auto opacity-75 d-none d-md-block"><small>Dijital Finans Projesi &copy; 2026</small></footer>
    </BrowserRouter>
  );
}