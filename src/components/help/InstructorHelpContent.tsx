import { useTranslation } from "react-i18next";

/**
 * Help content categories for the Instructor Help Drawer.
 * Returns translated help topics organized by category.
 */
export const useInstructorHelpContent = () => {
  const { t } = useTranslation();

  return [
    {
      id: "getting-started",
      title: t("help.categories.gettingStarted"),
      topics: [
        {
          id: "first-steps",
          title: t("help.topics.firstSteps.title"),
          content: (
            <div className="space-y-3">
              <p>{t("help.topics.firstSteps.intro")}</p>
              <ol className="list-decimal list-inside space-y-2 pl-2">
                <li><strong>{t("help.gettingStarted.step1Title")}:</strong> {t("help.gettingStarted.step1Desc")}</li>
                <li><strong>{t("help.gettingStarted.step2Title")}:</strong> {t("help.gettingStarted.step2Desc")}</li>
                <li><strong>{t("help.gettingStarted.step3Title")}:</strong> {t("help.gettingStarted.step3Desc")}</li>
                <li><strong>{t("help.gettingStarted.step4Title")}:</strong> {t("help.gettingStarted.step4Desc")}</li>
              </ol>
            </div>
          ),
        },
        {
          id: "profile-tips",
          title: t("help.topics.profileTips.title"),
          content: (
            <div className="space-y-3">
              <p>{t("help.topics.profileTips.intro")}</p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>{t("help.topics.profileTips.tip1")}</li>
                <li>{t("help.topics.profileTips.tip2")}</li>
                <li>{t("help.topics.profileTips.tip3")}</li>
                <li>{t("help.topics.profileTips.tip4")}</li>
              </ul>
            </div>
          ),
        },
      ],
    },
    {
      id: "courses",
      title: t("help.categories.courses"),
      topics: [
        {
          id: "course-visibility",
          title: t("help.courseCreation.visibilityTitle"),
          content: (
            <div className="space-y-3">
              <p>{t("help.courseCreation.visibilityIntro")}</p>
              <ul className="space-y-2 pl-2">
                <li><strong>{t("createCourse.public")}:</strong> {t("help.courseCreation.visibilityPublic")}</li>
                <li><strong>{t("createCourse.private")}:</strong> {t("help.courseCreation.visibilityPrivate")}</li>
              </ul>
            </div>
          ),
        },
        {
          id: "course-pricing",
          title: t("help.courseCreation.priceTitle"),
          content: (
            <div className="space-y-3">
              <p>{t("help.courseCreation.priceDesc")}</p>
            </div>
          ),
        },
        {
          id: "chapter-management",
          title: t("help.topics.chapters.title"),
          content: (
            <div className="space-y-3">
              <p>{t("help.topics.chapters.intro")}</p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>{t("help.topics.chapters.tip1")}</li>
                <li>{t("help.topics.chapters.tip2")}</li>
                <li>{t("help.topics.chapters.tip3")}</li>
              </ul>
            </div>
          ),
        },
      ],
    },
    {
      id: "video",
      title: t("help.categories.video"),
      topics: [
        {
          id: "video-upload",
          title: t("help.videoUpload.title"),
          content: (
            <div className="space-y-3">
              <ul className="space-y-2 pl-2">
                <li><strong>{t("help.videoUpload.formatsLabel")}:</strong> {t("help.videoUpload.formats")}</li>
                <li><strong>{t("help.videoUpload.processingLabel")}:</strong> {t("help.videoUpload.processing")}</li>
                <li><strong>{t("help.videoUpload.qualityLabel")}:</strong> {t("help.videoUpload.quality")}</li>
              </ul>
            </div>
          ),
        },
      ],
    },
    {
      id: "analytics",
      title: t("help.categories.analytics"),
      topics: [
        {
          id: "understanding-metrics",
          title: t("help.topics.metrics.title"),
          content: (
            <div className="space-y-3">
              <p>{t("help.topics.metrics.intro")}</p>
              <ul className="space-y-2 pl-2">
                <li><strong>{t("instructorDashboard.totalStudents")}:</strong> {t("help.topics.metrics.students")}</li>
                <li><strong>{t("instructorDashboard.totalRevenue")}:</strong> {t("help.topics.metrics.revenue")}</li>
                <li><strong>{t("analytics.completionRate")}:</strong> {t("help.topics.metrics.completion")}</li>
              </ul>
            </div>
          ),
        },
      ],
    },
  ];
};

export default useInstructorHelpContent;
