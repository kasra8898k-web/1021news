const Store = {
  _db: null,

  init() {
    const saved = localStorage.getItem('ten21_db');
    if (saved) {
      this._db = JSON.parse(saved);
    } else {
      this._db = this._seed();
      this._save();
    }
  },

  _save() {
    localStorage.setItem('ten21_db', JSON.stringify(this._db));
  },

  _seed() {
    const adminId = Utils.generateId();
    const userId1 = Utils.generateId();
    const userId2 = Utils.generateId();
    const userId3 = Utils.generateId();
    const now = Date.now();
    const day = 86400000;

    return {
      users: [
        { id: adminId, fullName: 'مدیر سایت', username: 'admin', password: '1234', role: 'admin', banned: false, canComment: true, createdAt: new Date(now - 30 * day).toISOString() },
        { id: userId1, fullName: 'علی محمدی', username: 'ali_m', password: '1234', role: 'user', banned: false, canComment: true, createdAt: new Date(now - 20 * day).toISOString() },
        { id: userId2, fullName: 'سارا احمدی', username: 'sara_a', password: '1234', role: 'user', banned: false, canComment: true, createdAt: new Date(now - 15 * day).toISOString() },
        { id: userId3, fullName: 'رضا کریمی', username: 'reza_k', password: '1234', role: 'user', banned: false, canComment: true, createdAt: new Date(now - 10 * day).toISOString() }
      ],
      news: [
        {
          id: Utils.generateId(),
          title: 'سخنرانی رئیس‌جمهور در مجمع عمومی سازمان ملل',
          content: 'رئیس‌جمهور در نطق خود در هفتاد و نهمین نشست مجمع عمومی سازمان ملل متحد، به تشریح سیاست‌های خارجی کشور پرداخت و بر لزوم گفتگوی سازنده میان ملت‌ها تأکید کرد. ایشان همچنین به مسائل زیست‌محیطی و تغییرات اقلیمی اشاره کرد و خواستار همکاری جهانی برای مقابله با این چالش‌ها شد.',
          excerpt: 'رئیس‌جمهور در نطق خود در مجمع عمومی سازمان ملل به تشریح سیاست‌های خارجی کشور پرداخت.',
          image: '',
          category: 'ریاضی',
          isImportant: true,
          isBreaking: false,
          authorId: adminId,
          createdAt: new Date(now - 1 * day).toISOString()
        },
        {
          id: Utils.generateId(),
          title: 'رشد ۱۵ درصدی صادرات غیرنفتی در شش ماه اول سال',
          content: 'وزیر صنعت، معدن و تجارت از رشد ۱۵ درصدی صادرات غیرنفتی در شش ماه نخست سال جاری خبر داد. به گفته وی، محصولات پتروشیمی، فولاد و محصولات کشاورزی بیشترین سهم را در این صادرات داشته‌اند.',
          excerpt: 'وزیر صنعت از رشد ۱۵ درصدی صادرات غیرنفتی در شش ماه نخست سال خبر داد.',
          image: '',
          category: 'عمومی',
          isImportant: true,
          isBreaking: false,
          authorId: adminId,
          createdAt: new Date(now - 2 * day).toISOString()
        },
        {
          id: Utils.generateId(),
          title: 'معرفی نسل جدید تراشه‌های ایرانی با فناوری ۷ نانومتری',
          content: 'پژوهشگران مرکز تحقیقات فناوری‌های پیشرفته از معرفی نسل جدید تراشه‌های ایرانی با فناوری ۷ نانومتری خبر دادند. این تراشه‌ها قابلیت رقابت با نمونه‌های خارجی را دارند.',
          excerpt: 'پژوهشگران از معرفی نسل جدید تراشه‌های ۷ نانومتری ایرانی خبر دادند.',
          image: '',
          category: 'شیمی',
          isImportant: false,
          isBreaking: true,
          authorId: userId1,
          createdAt: new Date(now - 3 * day).toISOString()
        },
        {
          id: Utils.generateId(),
          title: 'برگزاری اردوی تابستانی ویژه دانش‌آموزان برتر',
          content: 'اداره آموزش و پرورش از برگزاری اردوی تابستانی ویژه دانش‌آموزان برتر خبر داد. این اردو شامل برنامه‌های آموزشی، ورزشی و فرهنگی است.',
          excerpt: 'اردوی تابستانی ویژه دانش‌آموزان برتر برگزار می‌شود.',
          image: '',
          category: 'تابستانی',
          isImportant: false,
          isBreaking: false,
          authorId: userId2,
          createdAt: new Date(now - 4 * day).toISOString()
        },
        {
          id: Utils.generateId(),
          title: 'اعلام برنامه تعطیلات رسمی سال جاری',
          content: 'هیئت دولت برنامه تعطیلات رسمی سال جاری را اعلام کرد. بر این اساس تعطیلات نوروز و سایر مناسبت‌ها مشخص شده است.',
          excerpt: 'برنامه تعطیلات رسمی سال جاری اعلام شد.',
          image: '',
          category: 'تعطیلی',
          isImportant: false,
          isBreaking: false,
          authorId: adminId,
          createdAt: new Date(now - 5 * day).toISOString()
        },
        {
          id: Utils.generateId(),
          title: 'گفتگوی تلفنی وزیر خارجه با همتای عراقی',
          content: 'وزیر امور خارجه در گفتگوی تلفنی با همتای عراقی خود، درباره مسائل منطقه‌ای و روابط دوجانبه گفتگو کرد. دو طرف بر لزوم تقویت همکاری‌های اقتصادی تأکید کردند.',
          excerpt: 'وزیر خارجه با همتای عراقی درباره مسائل منطقه‌ای گفتگو کرد.',
          image: '',
          category: 'خارج از درس',
          isImportant: false,
          isBreaking: false,
          authorId: adminId,
          createdAt: new Date(now - 6 * day).toISOString()
        },
        {
          id: Utils.generateId(),
          title: 'کشف جدید دانشمندان ایرانی در زمینه پزشکی مولکولی',
          content: 'تیم تحقیقاتی دانشگاه علوم پزشکی تهران موفق به کشف مکانیسم جدیدی در زمینه درمان بیماری‌های نادر ژنتیکی شد. این کشف در مجله Nature Medicine منتشر شده است.',
          excerpt: 'دانشمندان ایرانی مکانیسم جدیدی برای درمان بیماری‌های نادر ژنتیکی کشف کردند.',
          image: '',
          category: 'فیزیک',
          isImportant: true,
          isBreaking: false,
          authorId: userId1,
          createdAt: new Date(now - 7 * day).toISOString()
        },
        {
          id: Utils.generateId(),
          title: 'آغاز ثبت‌نام طرح جدید حمایت از اشتغال جوانان',
          content: 'وزارت تعاون، کار و رفاه اجتماعی از آغاز ثبت‌نام طرح جدید حمایت از اشتغال جوانان خبر داد. این طرح شامل وام‌های کم‌بهره و آموزش‌های رایگان است.',
          excerpt: 'ثبت‌نام طرح حمایت از اشتغال جوانان آغاز شد.',
          image: '',
          category: 'بیانیه‌های رسمی',
          isImportant: false,
          isBreaking: false,
          authorId: adminId,
          createdAt: new Date(now - 8 * day).toISOString()
        },
        {
          id: Utils.generateId(),
          title: 'صحبت‌های مدیر مدرسه درباره برنامه سال تحصیلی جدید',
          content: 'مدیر مدرسه در جلسه والدین برنامه‌های سال تحصیلی جدید را تشریح کرد. از جمله برنامه‌ها می‌توان به برگزاری کلاس‌های فوق‌برنامه و اردوهای علمی اشاره کرد.',
          excerpt: 'مدیر مدرسه برنامه‌های سال تحصیلی جدید را تشریح کرد.',
          image: '',
          category: 'صحبت‌های مدرسه',
          isImportant: false,
          isBreaking: false,
          authorId: adminId,
          createdAt: new Date(now - 9 * day).toISOString()
        },
        {
          id: Utils.generateId(),
          title: 'برگزاری نمایشگاه بین‌المللی کتاب تهران',
          content: 'سی و پنجمین نمایشگاه بین‌المللی کتاب تهران با حضور ناشران داخلی و خارجی برگزار شد. بیش از ۳۰۰ هزار عنوان کتاب عرضه شده است.',
          excerpt: 'سی و پنجمین نمایشگاه کتاب تهران برگزار شد.',
          image: '',
          category: 'زیست‌شناسی',
          isImportant: false,
          isBreaking: false,
          authorId: userId3,
          createdAt: new Date(now - 10 * day).toISOString()
        }
      ],
      tasks: [
        {
          id: Utils.generateId(),
          title: 'تمرین فصل ۳ ریاضی - معادلات درجه دوم',
          content: 'تکلیف ریاضی: سؤالات صفحه ۸۵ تا ۹۰ کتاب درسی را حل کنید. تمرین‌های ۱ تا ۱۵ الزامی هستند.',
          excerpt: 'حل سؤالات فصل ۳ ریاضی.',
          image: '',
          category: 'ریاضی',
          isImportant: true,
          isBreaking: false,
          authorId: adminId,
          createdAt: new Date(now - 2 * day).toISOString()
        },
        {
          id: Utils.generateId(),
          title: 'گزارش آزمایش زیست‌شناسی - سلول',
          content: 'تکلیف زیست: گزارش آزمایش بررسی ساختار سلول را تهیه کنید. شامل نقاشی سلول و توضیح اندامک‌ها.',
          excerpt: 'تهیه گزارش آزمایش بررسی ساختار سلول.',
          image: '',
          category: 'زیست‌شناسی',
          isImportant: false,
          isBreaking: false,
          authorId: adminId,
          createdAt: new Date(now - 4 * day).toISOString()
        },
        {
          id: Utils.generateId(),
          title: 'مسائل شیمی - واکنش‌های شیمیایی',
          content: 'تکلیف شیمی: مسائل صفحه ۱۲۰ کتاب درسی را حل کنید. تمرین‌های ۱ تا ۱۰.',
          excerpt: 'حل مسائل فصل واکنش‌های شیمیایی.',
          image: '',
          category: 'شیمی',
          isImportant: false,
          isBreaking: false,
          authorId: userId1,
          createdAt: new Date(now - 6 * day).toISOString()
        },
        {
          id: Utils.generateId(),
          title: 'حل تمرین‌های فیزیک - نیرو و حرکت',
          content: 'تکلیف فیزیک: تمرین‌های فصل نیرو و حرکت را حل کنید. سؤالات چندگزینه‌ای و تشریحی.',
          excerpt: 'حل تمرین‌های فصل نیرو و حرکت فیزیک.',
          image: '',
          category: 'فیزیک',
          isImportant: true,
          isBreaking: false,
          authorId: adminId,
          createdAt: new Date(now - 7 * day).toISOString()
        },
        {
          id: Utils.generateId(),
          title: 'شرکت در اردوی تابستانی علمی',
          content: 'تکلیف: ثبت‌نام در اردوی تابستانی علمی و تهیه گزارش از برنامه‌ها.',
          excerpt: 'ثبت‌نام و شرکت در اردوی تابستانی علمی.',
          image: '',
          category: 'تابستانی',
          isImportant: false,
          isBreaking: false,
          authorId: userId2,
          createdAt: new Date(now - 9 * day).toISOString()
        }
      ],
      comments: [],
      currentUser: null
    };
  },

  getAll(collection) { return this._db[collection] || []; },

  getById(collection, id) {
    return (this._db[collection] || []).find(item => item.id === id);
  },

  create(collection, data) {
    const item = { id: Utils.generateId(), ...data, createdAt: new Date().toISOString() };
    this._db[collection].push(item);
    this._save();
    return item;
  },

  update(collection, id, data) {
    const idx = this._db[collection].findIndex(item => item.id === id);
    if (idx === -1) return null;
    this._db[collection][idx] = { ...this._db[collection][idx], ...data };
    this._save();
    return this._db[collection][idx];
  },

  remove(collection, id) {
    this._db[collection] = this._db[collection].filter(item => item.id !== id);
    this._save();
  },

  getUserByUsername(username) {
    return this._db.users.find(u => u.username === username);
  },

  isAdmin() {
    const user = this.getCurrentUser();
    return user && user.role === 'admin';
  },

  getCurrentUser() {
    if (this._db.currentUser) {
      return this.getById('users', this._db.currentUser.id);
    }
    return null;
  },

  setCurrentUser(user) {
    this._db.currentUser = user ? { id: user.id } : null;
    this._save();
  },

  getApprovedComments(entityType, entityId) {
    return this._db.comments.filter(c =>
      c.entityType === entityType && c.entityId === entityId && c.approved
    ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  getPendingComments() {
    return this._db.comments.filter(c => !c.approved);
  },

  approveComment(id) {
    this.update('comments', id, { approved: true });
  },

  getStats() {
    return {
      totalUsers: this._db.users.length,
      totalNews: this._db.news.length,
      totalTasks: this._db.tasks.length,
      totalComments: this._db.comments.length,
      pendingComments: this._db.comments.filter(c => !c.approved).length,
      bannedUsers: this._db.users.filter(u => u.banned).length
    };
  },

  seedComments() {
    const newsItems = this.getAll('news');
    const users = this.getAll('users').filter(u => u.role !== 'admin');
    if (newsItems.length > 0 && this._db.comments.length <= 2) {
      const sampleComments = [
        { entityType: 'news', entityId: newsItems[0].id, userId: users[0]?.id, text: 'مقاله بسیار جامع و مفیدی بود.', approved: true },
        { entityType: 'news', entityId: newsItems[1].id, userId: users[1]?.id, text: 'آمار صادرات واقعاً امیدوارکننده است.', approved: true },
        { entityType: 'news', entityId: newsItems[2].id, userId: users[0]?.id, text: 'پیشرفت خوبی در حوزه فناوری داشته‌ایم.', approved: false }
      ];
      sampleComments.forEach(c => { if (c.userId) this.create('comments', c); });
    }
  }
};
