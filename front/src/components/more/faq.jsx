import { Link } from 'react-router-dom'
import   './more.css'

const Faq = () => {
    return (
        <div className='container-fluid min-vh-100 about-container'>

            <p className='mx-auto w-25 fw-bold fs-1 my-5 text-secondary'> سؤال وجواب</p>
            <div className='mx-auto w-75 '>

                <div className='bg-info pe-2 py-2 '>ما هو موقع "لافتة" وكيف يعمل ؟</div>
                <div className='bg-light mb-2 py-4 pe-2'>لافتة" موقع دعائي يعرض لافتات للأنشطة التجارية والمهن والحرف التي نحتاج لخدماتها؛ بالاضافة لفئات اخرى مثل منتجات وخدمات؛ ومناسبات ؛ ومطلوب؛ ومفقود. لافتة بمثابة دليل الكتروني مميز وعصري</div>
               
                <div className='bg-info pe-2 py-2 '>ما هي أقسام موقع لافتة وفائدة كل قسم منها؟</div>
                <ul className='bg-light mb-2 py-4'>
                    <li>أنشطة : لعرض الأنشطة التجارية كالمطاعم والمتاجر والمراكز التعليمية والعيادات.... الخ</li>
                    <li>مهن: لعرض المهن مثل مبرمج؛ مترجم؛ مصمم؛ معلم؛ مهندس ولعرض الحرف مثل كهربائي؛ ميكانيكي؛ سباك</li>
                    <li>منتجات وخدمات: لعرض منتجات وخدمات زراعية؛ صحية؛ غذائية؛ سياحية؛ الكترونية</li>
                    <li>مناسبات: للترويج لمناسبة مثل مناسبة رياضية؛ اجتماع؛ احتفال؛ بث مباشر ...</li>
                    <li>مطلوب: لطلب عمل؛ بضاعة؛ شراكة؛ تطوع؛ تبرع</li>
                    <li>مفقود: للبحث عن أشياء مفقودة أو معثور عليها</li>
                </ul>

                <div className='bg-info pe-2 py-2 py-2'>ما هي اللافتة؟</div>
                <div className='bg-light mb-2 py-4 pe-2'>اللافتة هي "يافطة" نشاطك التجاري في فئة أنشطة أو "صورة الكارت الشخصي الخاص بك" في فئة مهن أو "صورة تروّج لمنتج تسوّقه أو خدمة تقدمها" في فئة منتجات وخدمات؛ او "صورة تروّج لمناسبة" في فئة مناسبات؛ أو "صورة تروّج لشيء تطلبه (وظيفة – شراكة – بضاعة...الخ)" في فئة مطلوب؛ أو "صورة لشيء مفقود تبحث عنه أو شيء عثرت عليه" في فئة مفقود</div>

                <div className='bg-info pe-2 py-2 '>ما فائدة الموقع لي كصاحب نشاط أو كمستخدم عادي ؟</div>
                <ul className='bg-light mb-2 py-4'>
                    <li>أولاً: كصاحب نشاط يساعك لافتة في الترويج لنشاطك والوصول لعملاء جدد وذلك من خلال تعليقات عملائك السابقين عن تجربتهم معك مما يزيد من ثقة الناس في خدماتك ويجذب لك عملاء جدد. حيث تحتوي لافتة نشاطك على كل التفاصيل مع وسائل الاتصال بك؛ كما يمكن للزائر مشاهدة كل ما قمت باضافته من لافتات في مكان واحد من خلال الضغط على اسم المستخدم الخاص بك</li>
                    <li>ثانياً: كمستخدم يعتبر موقع "لافتة" بمثابة مرجع جذاب وسهل الاستخدام تجد فيه ما تحتاجه من الخدمات والمنتجات في مدينتك ومدن اخرى مع امكانية التعرف على اراء الاخرين وتجاربهم التي تسهل عليك الاختيار.';</li>
                </ul>
                
                <div className='bg-info pe-2 py-2 '>كيف أختار الفئة المناسبة؟</div>
                <ul className='bg-light mb-2 py-4'>
                    <li>اختر فئة أنشطة اذا كنت صاحب نشط تجاري" مطعم؛ ماركت؛ جيم؛ عيادة...الخ</li>
                    <li>اختر فئة مهن اذا كنت صاحب مهنة مثل (مترجم؛ معلم؛ خبير؛ مصمم...الخ) أو صاحب حرفة مثل( سباك؛ كهربائي؛ نجار...الخ)</li>
                    <li> اختر فئة منتجات وخدمات اذا كنت:
                        <ul>
                            <li> تصنع أو تبيع منتج معين:
                                <ul>
                                    <li> منتج غذائي (عصائر – حلويات مغلفة – طعام منزلي ... الخ)</li>
                                    <li> منتج الكتروني ( ملحقات الكمبيوتر – برمجيات ... الخ)</li>
                                    <li> منتجات أخرى(مشغولات يدوية – اكسسوارات ...الخ)</li>
                                </ul>
                            </li>
                            <li>أو تقدم خدمة معينة (مثل نقل أفراد – نقل بضائع – خدمة مرافقة أو تمريض مسنين – تنظيف منزل – تخليص  أوراق – تركيب شبكات ري ...الخ)</li>
                           
                        </ul>
                    </li>
                    <li>اختر فئة مناسبات اذا كان لديك مناسبة قادمة (رياضية – احتفال – اجتماع – بث مباشر ... الخ)</li>
                    <li>اختر فئة مطلوب اذا كنت تبحث عن (شركاء – بضائع معينة – تبرعات لجمعية خيرية ...الخ)</li>
                    <li>اختر فئة مفقود لتعريف الاخرين بشيء فقدته أو عثرت عليه مثل(أموال – مشغولات ذهبية – اوراق هامة – اجهزة ...الخ)</li>
                </ul>

                <div className='bg-info pe-2 py-2 '>ما الفرق بين فئة انشطة وفئة مهن؟</div>
                <div className='bg-light mb-2 py-4 pe-2'>فئة أنشطة لمن يمتلكون مكان يمكن أن نتوجه اليه للحصول على الخدمة مثل المكتب؛ المتجر؛ المطعم ...الخ؛ أما فئة مهن وحرف لمن لا يمتلكون مكان يمارسون فيه عملهم مثل السباك والكهربائي والمترجم</div>
               
                <div className='bg-info pe-2 py-2 '>هل مسموح لي باضافة عدد معين من اللافتات؟</div>
                <div className='bg-light mb-2 py-4 pe-2'>يمكن اضافة أي عدد تريده من اللافتات في كل الفئات.</div>

                <div className='bg-info pe-2 py-2 '>كم مدة بقاء لافتاتي على الموقع؟</div>
                <div className='bg-light mb-2 py-4 pe-2'>في فئات (أنشطة؛ ومهن؛ ومنتجات وخدمات) تبقى اللافتة مدى الحياة ما لم يقم صاحبها بحذفها؛ أما في الفئات الاخرى تظل اللافتة معروضة على الموقع لمدة ثلاثة أشهر ثم تُحذف تلقائياً</div>

                <div className='bg-info pe-2 py-2 '>ما الفرق بين اللافتات المميزة والعادية؟</div>
                <ul className='bg-light mb-2 py-4'>
                    <li>اللافتات المميزة نوعان:
                        <ul>
                            <li>مميزة ذهبية
                                <ul>
                                    <li>يظهر بصفة دائمة في الصفحة الرئيسية ما لم تنتهي مدة تمييزة؛ واذا انتهت مدة التمييز يظل كما هو بالموقع ولكن لا يظهر في الصفحة الرئيسية بل يظهر مع الاعلانات العادية</li>
                                    <li> له أولوية مطلقة في الظهور بصفحة البحث حيث يظهر قبل الاعلانات العادية وقبل الاعلانات المميزة الفضية</li>
                                </ul>
                            </li>
                            <li>مميزة فضية
                                <ul>
                                    <li>يظهر بصفحة البحث قبل الاعلانات العادية</li>
                                </ul>
                            </li>

                        </ul>
                    </li>
                </ul>

                <div className='bg-info pe-2 py-2 '>كيف يمكن تمييز لافتة؟</div>
                <div className='bg-light mb-2 py-4 pe-2 pe-2'>اذهب الى "حسابي" ثم  "لافتاتي" ؛ حدد اللافتة التي تريد تمييزها ثم اضغط على &nbsp; <i className='bi bi-rocket-takeoff-fill'></i></div>

              
            </div>
        </div>
    )
}

export default Faq
