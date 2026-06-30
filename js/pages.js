const Pages = {
  render(content) {
    const app = document.getElementById('app');
    const navHtml = Auth.isLoggedIn() ? Components.navbar() : '';
    const isLoginPage = location.hash === '#/login' || location.hash === '#/register' || location.hash === '';
    app.innerHTML = `
      ${!isLoginPage ? navHtml : ''}
      <main class="${!isLoginPage ? 'pt-0' : ''}">${content}</main>`;
    if (!isLoginPage) {
      window.scrollTo(0, 0);
      const main = app.querySelector('main');
      if (main) main.classList.add('page-enter');
      this.initNavbarScroll();
      this.initSearch();
    }
  },

  initNavbarScroll() {
    const navbar = document.getElementById('mainNavbar');
    if (!navbar) return;
    const handler = () => {
      if (window.scrollY > 10) navbar.classList.add('scrolled');
      else navbar.classList.remove('scrolled');
    };
    window.removeEventListener('scroll', handler);
    window.addEventListener('scroll', handler);
  },

  initSearch() {
    const input = document.getElementById('searchInput');
    if (!input) return;
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const q = input.value.trim();
        if (q) Router.navigate('search', { q });
      }
    });
  },

  _getGreeting() {
    const h = new Date().getHours();
    if (h < 6) return 'شب بخیر';
    if (h < 12) return 'صبح بخیر';
    if (h < 17) return 'عصر بخیر';
    return 'شب بخیر';
  },

  // ---- HOME ----
  home() {
    if (!Auth.requireAuth()) return;
    const user = Auth.getCurrentUser();
    const allNews = Store.getAll('news').sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const importantNews = allNews.filter(n => n.isImportant).slice(0, 3);
    const latestNews = allNews.slice(0, 6);
    const allTasks = Store.getAll('tasks').sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3);
    const groups = Utils.getCategoryGroups();

    this.render(`
    <div class="hero-gradient text-white py-16 md:py-20 relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="max-w-3xl">
          <p class="text-red-300 text-sm mb-3 font-medium">${this._getGreeting()}، ${Utils.escapeHtml(user.fullName)}</p>
          <h1 class="text-3xl md:text-5xl font-black mb-4 leading-tight">۱۰.۲۱ <span class="text-red-400">نيوز</span></h1>
          <p class="text-gray-300 text-lg md:text-xl mb-8 leading-relaxed">پایگاه خبری و تکالیف جامع و به‌روز</p>
          <div class="flex gap-3 flex-wrap">
            <a href="#/news" class="btn btn-red btn-lg">آخرین اخبار</a>
            <a href="#/important" class="btn btn-lg" style="background:rgba(255,255,255,0.15);color:white;border:1px solid rgba(255,255,255,0.3)">اخبار مهم</a>
          </div>
        </div>
      </div>
    </div>

    ${importantNews.length > 0 ? `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
      <div class="grid md:grid-cols-3 gap-4 stagger">
        ${importantNews.map(n => `
          <a href="#/news/${n.id}" class="bg-white rounded-2xl p-4 card-hover shadow-lg flex items-center gap-3">
            <div class="w-16 h-16 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
              <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
            <div class="min-w-0">
              <div class="flex items-center gap-2 mb-1">
                ${n.isBreaking ? '<span class="text-xs font-bold" style="color:#CA8A04">فوری</span>' : ''}
              </div>
              <h3 class="font-bold text-sm text-gray-900 line-clamp-2">${Utils.escapeHtml(n.title)}</h3>
              <span class="text-xs text-gray-400 mt-1 block">${Utils.timeAgo(n.createdAt)}</span>
            </div>
          </a>
        `).join('')}
      </div>
    </div>` : ''}

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold flex items-center gap-2">
              <span class="w-1 h-6 bg-red-500 rounded-full"></span>
              آخرین اخبار
            </h2>
            <a href="#/news" class="text-sm text-red-500 hover:text-red-600 font-medium">مشاهده همه →</a>
          </div>
          <div class="grid sm:grid-cols-2 gap-4 stagger">
            ${latestNews.length > 0 ?
              latestNews.map(n => Components.newsCard(n, 'news')).join('') :
              Components.emptyState('هنوز خبری منتشر نشده است.')}
          </div>
        </div>
        <div>
          <div class="bg-white rounded-2xl p-6 shadow-sm sticky top-20">
            <h3 class="font-bold mb-4 flex items-center gap-2">
              <span class="w-1 h-6 bg-red-500 rounded-full"></span>
              تکالیف جاری
            </h3>
            ${allTasks.length > 0 ? allTasks.map(t => `
              <a href="#/tasks/${t.id}" class="block py-3 border-b border-gray-100 last:border-0 hover:text-red-600 transition-colors">
                <h4 class="font-medium text-sm mb-1">${Utils.escapeHtml(t.title)}</h4>
                <div class="flex items-center gap-2 text-xs text-gray-400">
                  <span class="badge text-xs" style="background:${Utils.getCategoryColor(t.category).bg};color:${Utils.getCategoryColor(t.category).text}">${t.category}</span>
                  <span>·</span>
                  <span>${Utils.timeAgo(t.createdAt)}</span>
                </div>
              </a>
            `).join('') : '<p class="text-sm text-gray-400">تکلیفی ثبت نشده است.</p>'}

            <div class="mt-6 pt-4 border-t">
              <h4 class="font-bold text-sm mb-3">دسته‌بندی‌ها</h4>
              ${groups.map(g => `
                <div class="mb-3">
                  <p class="text-xs text-gray-400 font-medium mb-2">${g.group}</p>
                  <div class="flex flex-wrap gap-2">
                    ${g.items.map(cat => {
                      const c = Utils.getCategoryColor(cat);
                      return `<a href="#/news?cat=${encodeURIComponent(cat)}" class="badge text-xs hover:scale-105 transition-transform cursor-pointer" style="background:${c.bg};color:${c.text}">${cat}</a>`;
                    }).join('')}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>`);
  },

  // ---- NEWS LISTING ----
  newsList() {
    if (!Auth.requireAuth()) return;
    const params = new URLSearchParams(location.hash.split('?')[1] || '');
    const cat = params.get('cat');
    let news = Store.getAll('news').sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (cat) news = news.filter(n => n.category === cat);

    const allCats = Utils.getAllCategoryNames();
    const activeCats = [...new Set(Store.getAll('news').map(n => n.category))];
    const displayCats = ['همه', ...allCats.filter(c => activeCats.includes(c))];
    const groups = Utils.getCategoryGroups();

    this.render(`
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h1 class="text-2xl font-bold mb-2">اخبار</h1>
        <p class="text-gray-500">آخرین اخبار و رویدادها</p>
      </div>
      <div class="mb-6 space-y-3">
        ${groups.map(g => {
          const groupCats = g.items.filter(c => displayCats.includes(c));
          if (groupCats.length === 0) return '';
          return `
          <div>
            <p class="text-xs text-gray-400 font-medium mb-2">${g.group}</p>
            <div class="flex flex-wrap gap-2">
              ${groupCats.map(c => {
                const isActive = c === cat;
                const color = Utils.getCategoryColor(c);
                return `<button onclick="location.hash='#/news?cat=${encodeURIComponent(c)}'" class="badge text-sm cursor-pointer transition-all ${isActive ? 'ring-2 ring-red-500' : ''}" style="background:${color.bg};color:${color.text}">${c}</button>`;
              }).join('')}
            </div>
          </div>`;
        }).join('')}
        <button onclick="location.hash='#/news'" class="badge text-sm cursor-pointer transition-all ${!cat ? 'ring-2 ring-red-500' : ''}" style="${!cat ? 'background:#C8102E;color:white' : 'background:#f3f4f6;color:#374151'}">همه</button>
      </div>
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger">
        ${news.length > 0 ?
          news.map(n => Components.newsCard(n, 'news')).join('') :
          Components.emptyState('خبری یافت نشد.')}
      </div>
    </div>`);
  },

  // ---- SINGLE NEWS ----
  newsDetail(id) {
    if (!Auth.requireAuth()) return;
    const item = Store.getById('news', id);
    if (!item) { this.render(Components.emptyState('خبر یافت نشد.')); return; }
    const author = Store.getById('users', item.authorId);
    const catColor = Utils.getCategoryColor(item.category);
    const allNews = Store.getAll('news').filter(n => n.id !== id).slice(0, 4);

    this.render(`
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <a href="#/news" class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 mb-6 transition-colors">
        <svg class="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
        بازگشت به لیست اخبار
      </a>
      <article>
        <div class="flex items-center gap-3 mb-4 flex-wrap">
          <span class="badge text-xs" style="background:${catColor.bg};color:${catColor.text}">${item.category}</span>
          ${item.isImportant ? '<span class="badge text-xs bg-red-500 text-white">مهم</span>' : ''}
          ${item.isBreaking ? '<span class="badge text-xs" style="background:#FACC15;color:#713F12">خبر فوری</span>' : ''}
          <span class="text-xs text-gray-400">${Utils.persianDate(item.createdAt)}</span>
        </div>
        <h1 class="text-2xl md:text-3xl font-black mb-4 leading-8">${Utils.escapeHtml(item.title)}</h1>
        <div class="flex items-center gap-3 mb-6 pb-6 border-b">
          <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-sm">
            ${author ? author.fullName.charAt(0) : '?'}
          </div>
          <div>
            <p class="text-sm font-medium text-gray-900">${author ? Utils.escapeHtml(author.fullName) : 'ناشناس'}</p>
            <p class="text-xs text-gray-400">${Utils.timeAgo(item.createdAt)}</p>
          </div>
        </div>
        ${item.image ? `<img src="${item.image}" alt="${Utils.escapeHtml(item.title)}" class="w-full rounded-2xl mb-6 max-h-96 object-cover">` : ''}
        <div class="prose prose-lg max-w-none text-gray-700 leading-8 text-justify whitespace-pre-line">${Utils.escapeHtml(item.content)}</div>
      </article>
      ${Components.commentSection('news', item.id)}
      ${allNews.length > 0 ? `
      <div class="mt-12 border-t pt-8">
        <h3 class="font-bold mb-4">اخبار مرتبط</h3>
        <div class="grid sm:grid-cols-2 gap-4 stagger">
          ${allNews.map(n => Components.newsCard(n, 'news')).join('')}
        </div>
      </div>` : ''}
    </div>`);
  },

  // ---- TASKS LISTING ----
  tasksList() {
    if (!Auth.requireAuth()) return;
    const params = new URLSearchParams(location.hash.split('?')[1] || '');
    const cat = params.get('cat');
    let tasks = Store.getAll('tasks').sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (cat) tasks = tasks.filter(t => t.category === cat);

    const allCats = Utils.getAllCategoryNames();
    const activeCats = [...new Set(Store.getAll('tasks').map(t => t.category))];
    const displayCats = ['همه', ...allCats.filter(c => activeCats.includes(c))];
    const groups = Utils.getCategoryGroups();

    this.render(`
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h1 class="text-2xl font-bold mb-2">تکالیف</h1>
        <p class="text-gray-500">تکالیف و مأموریت‌های درسی و فوق‌برنامه</p>
      </div>
      <div class="mb-6 space-y-3">
        ${groups.map(g => {
          const groupCats = g.items.filter(c => displayCats.includes(c));
          if (groupCats.length === 0) return '';
          return `
          <div>
            <p class="text-xs text-gray-400 font-medium mb-2">${g.group}</p>
            <div class="flex flex-wrap gap-2">
              ${groupCats.map(c => {
                const isActive = c === cat;
                const color = Utils.getCategoryColor(c);
                return `<button onclick="location.hash='#/tasks?cat=${encodeURIComponent(c)}'" class="badge text-sm cursor-pointer transition-all ${isActive ? 'ring-2 ring-red-500' : ''}" style="background:${color.bg};color:${color.text}">${c}</button>`;
              }).join('')}
            </div>
          </div>`;
        }).join('')}
        <button onclick="location.hash='#/tasks'" class="badge text-sm cursor-pointer transition-all ${!cat ? 'ring-2 ring-red-500' : ''}" style="${!cat ? 'background:#C8102E;color:white' : 'background:#f3f4f6;color:#374151'}">همه</button>
      </div>
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger">
        ${tasks.length > 0 ?
          tasks.map(t => Components.newsCard(t, 'tasks')).join('') :
          Components.emptyState('تکلیفی ثبت نشده است.')}
      </div>
    </div>`);
  },

  // ---- SINGLE TASK ----
  taskDetail(id) {
    if (!Auth.requireAuth()) return;
    const item = Store.getById('tasks', id);
    if (!item) { this.render(Components.emptyState('تکلیف یافت نشد.')); return; }
    const author = Store.getById('users', item.authorId);
    const catColor = Utils.getCategoryColor(item.category);

    this.render(`
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <a href="#/tasks" class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 mb-6 transition-colors">
        <svg class="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
        بازگشت به لیست تکالیف
      </a>
      <article>
        <div class="flex items-center gap-3 mb-4 flex-wrap">
          <span class="badge text-xs" style="background:${catColor.bg};color:${catColor.text}">${item.category}</span>
          ${item.isImportant ? '<span class="badge text-xs bg-red-500 text-white">مهم</span>' : ''}
          ${item.isBreaking ? '<span class="badge text-xs" style="background:#FACC15;color:#713F12">خبر فوری</span>' : ''}
          <span class="text-xs text-gray-400">${Utils.persianDate(item.createdAt)}</span>
        </div>
        <h1 class="text-2xl md:text-3xl font-black mb-4 leading-8">${Utils.escapeHtml(item.title)}</h1>
        <div class="flex items-center gap-3 mb-6 pb-6 border-b">
          <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-sm">
            ${author ? author.fullName.charAt(0) : '?'}
          </div>
          <div>
            <p class="text-sm font-medium text-gray-900">${author ? Utils.escapeHtml(author.fullName) : 'ناشناس'}</p>
            <p class="text-xs text-gray-400">${Utils.timeAgo(item.createdAt)}</p>
          </div>
        </div>
        ${item.image ? `<img src="${item.image}" alt="${Utils.escapeHtml(item.title)}" class="w-full rounded-2xl mb-6 max-h-96 object-cover">` : ''}
        <div class="prose prose-lg max-w-none text-gray-700 leading-8 text-justify whitespace-pre-line">${Utils.escapeHtml(item.content)}</div>
      </article>
      ${Components.commentSection('task', item.id)}
    </div>`);
  },

  // ---- IMPORTANT NEWS ----
  importantNews() {
    if (!Auth.requireAuth()) return;
    const important = Store.getAll('news').filter(n => n.isImportant).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    this.render(`
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h1 class="text-2xl font-bold mb-2 flex items-center gap-2">
          <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          اخبار مهم
        </h1>
        <p class="text-gray-500">اخبار مهم و ویژه توسط مدیریت</p>
      </div>
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger">
        ${important.length > 0 ?
          important.map(n => Components.newsCard(n, 'news')).join('') :
          Components.emptyState('اخبار مهمی ثبت نشده است.')}
      </div>
    </div>`);
  },

  // ---- SEARCH ----
  search() {
    if (!Auth.requireAuth()) return;
    const params = new URLSearchParams(location.hash.split('?')[1] || '');
    const q = params.get('q') || '';
    let results = [];
    if (q) {
      const newsResults = Utils.search(q, Store.getAll('news'), ['title', 'content', 'category', 'excerpt']).map(n => ({ ...n, _type: 'news' }));
      const taskResults = Utils.search(q, Store.getAll('tasks'), ['title', 'content', 'category', 'excerpt']).map(t => ({ ...t, _type: 'tasks' }));
      results = [...newsResults, ...taskResults].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    this.render(`
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h1 class="text-2xl font-bold mb-2">نتایج جستجو</h1>
        <p class="text-gray-500">${q ? `نتایج جستجو برای «${Utils.escapeHtml(q)}» (${results.length} نتیجه)` : 'عبارتی وارد کنید'}</p>
      </div>
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger">
        ${results.length > 0 ?
          results.map(r => Components.newsCard(r, r._type)).join('') :
          Components.emptyState('نتیجه‌ای یافت نشد.')}
      </div>
    </div>`);
  },

  // ---- LOGIN ----
  login() {
    if (Auth.isLoggedIn()) { Router.navigate('home'); return; }
    this.render(`
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-red-900 px-4">
      <div class="w-full max-w-md">
        <div class="text-center mb-8">
          <div class="inline-block mb-4">${Components.logo()}</div>
          <h1 class="text-2xl font-bold text-white mt-4">ورود به حساب کاربری</h1>
          <p class="text-gray-400 text-sm mt-2">برای دسترسی به محتوا وارد شوید</p>
        </div>
        <div class="bg-white rounded-2xl p-8 shadow-xl slide-up">
          <form onsubmit="Pages.handleLogin(event)">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">نام کاربری</label>
              <input type="text" id="loginUsername" class="input" placeholder="نام کاربری خود را وارد کنید" required>
            </div>
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-1">رمز عبور</label>
              <input type="password" id="loginPassword" class="input" placeholder="رمز عبور" required>
            </div>
            <button type="submit" class="btn btn-red w-full btn-lg">ورود</button>
          </form>
          <div class="mt-6 text-center">
            <p class="text-sm text-gray-500">
              حساب کاربری ندارید؟
              <a href="#/register" class="text-red-500 hover:text-red-600 font-medium">ثبت‌نام کنید</a>
            </p>
          </div>
          <div class="mt-4 p-3 bg-gray-50 rounded-xl text-xs text-gray-400 text-center">
            پیش‌فرض: admin / 1234
          </div>
        </div>
      </div>
    </div>`);
  },

  handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    const result = Auth.login(username, password);
    if (result.error) Utils.showToast(result.error, 'error');
    else { Utils.showToast('خوش آمدید!', 'success'); Router.navigate('home'); }
  },

  // ---- REGISTER ----
  register() {
    if (Auth.isLoggedIn()) { Router.navigate('home'); return; }
    this.render(`
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-red-900 px-4">
      <div class="w-full max-w-md">
        <div class="text-center mb-8">
          <div class="inline-block mb-4">${Components.logo()}</div>
          <h1 class="text-2xl font-bold text-white mt-4">ایجاد حساب کاربری</h1>
          <p class="text-gray-400 text-sm mt-2">عضویت در ۱۰.۲۱ نیوز</p>
        </div>
        <div class="bg-white rounded-2xl p-8 shadow-xl slide-up">
          <form onsubmit="Pages.handleRegister(event)">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">نام کامل</label>
              <input type="text" id="regFullName" class="input" placeholder="نام و نام خانوادگی" required>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">نام کاربری</label>
              <input type="text" id="regUsername" class="input" placeholder="نام کاربری (حداقل ۳ کاراکتر)" required>
            </div>
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-1">رمز عبور</label>
              <input type="password" id="regPassword" class="input" placeholder="رمز عبور (حداقل ۴ کاراکتر)" required>
            </div>
            <button type="submit" class="btn btn-red w-full btn-lg">ثبت‌نام</button>
          </form>
          <div class="mt-6 text-center">
            <p class="text-sm text-gray-500">
              قبلاً ثبت‌نام کرده‌اید؟
              <a href="#/login" class="text-red-500 hover:text-red-600 font-medium">وارد شوید</a>
            </p>
          </div>
        </div>
      </div>
    </div>`);
  },

  handleRegister(e) {
    e.preventDefault();
    const fullName = document.getElementById('regFullName').value;
    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;
    const result = Auth.register(fullName, username, password);
    if (result.error) Utils.showToast(result.error, 'error');
    else { Utils.showToast('ثبت‌نام موفقیت‌آمیز بود!', 'success'); Router.navigate('home'); }
  },

  // ---- PROFILE ----
  profile() {
    if (!Auth.requireAuth()) return;
    const user = Auth.getCurrentUser();
    const myNews = Store.getAll('news').filter(n => n.authorId === user.id);
    const myComments = Store.getAll('comments').filter(c => c.userId === user.id);
    this.render(`
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-2xl p-8 shadow-sm mb-8 slide-up">
        <div class="flex items-center gap-4 mb-6">
          <div class="w-20 h-20 rounded-2xl bg-red-100 flex items-center justify-center text-red-600 font-black text-3xl">${user.fullName.charAt(0)}</div>
          <div>
            <h1 class="text-2xl font-black">${Utils.escapeHtml(user.fullName)}</h1>
            <p class="text-gray-500">@${Utils.escapeHtml(user.username)}</p>
            <span class="badge mt-2 ${user.role === 'admin' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}">${user.role === 'admin' ? 'مدیر' : 'کاربر'}</span>
          </div>
        </div>
        <div class="grid grid-cols-3 gap-4 text-center border-t pt-6">
          <div>
            <p class="text-2xl font-black text-red-500">${myNews.length}</p>
            <p class="text-sm text-gray-500">اخبار</p>
          </div>
          <div>
            <p class="text-2xl font-black text-red-500">${myComments.length}</p>
            <p class="text-sm text-gray-500">نظرات</p>
          </div>
          <div>
            <p class="text-2xl font-black text-red-500">${Utils.persianDate(user.createdAt)}</p>
            <p class="text-sm text-gray-500">تاریخ عضویت</p>
          </div>
        </div>
      </div>
      ${myNews.length > 0 ? `
      <div>
        <h2 class="text-xl font-bold mb-4">اخبار منتشر شده</h2>
        <div class="grid sm:grid-cols-2 gap-4 stagger">
          ${myNews.map(n => Components.newsCard(n, 'news')).join('')}
        </div>
      </div>` : ''}
    </div>`);
  },

  // ---- COMMENT SUBMIT ----
  submitComment(entityType, entityId) {
    const textarea = document.getElementById('commentText');
    if (!textarea) return;
    const text = textarea.value.trim();
    if (!text) { Utils.showToast('نظر نمی‌تواند خالی باشد', 'error'); return; }
    const user = Auth.getCurrentUser();
    Store.create('comments', { entityType, entityId, userId: user.id, text, approved: false });
    textarea.value = '';
    Utils.showToast('نظر شما ثبت شد و پس از تأیید نمایش داده خواهد شد.', 'success');
  }
};
