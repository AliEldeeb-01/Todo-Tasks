import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
const STORAGE_KEY = 'todo-plan-sheets'

function loadPlans() {
    try {
        const savedPlans = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
        return Array.isArray(savedPlans)
            ? savedPlans.filter(
                (plan) =>
                    plan &&
                    (typeof plan.id === 'string' || typeof plan.id === 'number') &&
                    (typeof plan.title === 'string' || typeof plan.title === 'number') &&
                    (typeof plan.details === 'string' || typeof plan.details === 'number'),
            )
            : []
    } catch (error) {
        console.warn('Could not load plan sheets from localStorage.', error)
        return []
    }
}

export default function Sheet() {
    const [plans, setPlans] = useState(loadPlans)
    const [newTitle, setNewTitle] = useState('')
    const [activePlanId, setActivePlanId] = useState(null)
    const [draftTitle, setDraftTitle] = useState('')
    const [draftDetails, setDraftDetails] = useState('')

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(plans))
        } catch (error) {
            console.warn('Could not save plan sheets to localStorage.', error)
        }
    }, [plans])

    const activePlan = plans.find((plan) => plan.id === activePlanId)

    const addPlan = (event) => {


        event.preventDefault()
        const title = newTitle.trim()
        if (!title) return

        setPlans((currentPlans) => [
            ...currentPlans,
            { id: `${Date.now()}-${Math.random()}`, title, details: '' },
        ])
        setNewTitle('')
    }

    const openPlan = (plan) => {
        setActivePlanId(plan.id)
        setDraftTitle(plan.title)
        setDraftDetails(plan.details)
    }

    const savePlan = (event) => {
        event.preventDefault()
        const title = draftTitle.trim()
        if (!title || activePlanId === null) return

        setPlans((currentPlans) =>
            currentPlans.map((plan) =>
                plan.id === activePlanId
                    ? { ...plan, title, details: draftDetails }
                    : plan,
            ),
        )
        setActivePlanId(null)
    }

    const deletePlan = (plan) => {

        Swal.fire({
            title: "Are you sure from deleting this paln ?",
            text: "You won't be able to revert this!",
            backdrop: 'swal2-backdrop-show',
            backdrop: 'true',
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
            theme: 'dark'
        }).then((result) => {
            if (result.isConfirmed) {
                setPlans((currentPlans) =>
                    currentPlans.filter((currentPlan) => currentPlan.id !== plan.id),
                )
                setActivePlanId(null)
                Swal.fire({
                    title: "Deleted!",
                    text: "Your file has been deleted.",
                    icon: "success",
                    theme: 'dark',



                });
            }
        });


    }

    return (
        <section className="sheet-page" aria-label="Planning Area">
            {activePlan ? (
                <>
                    <div className="sheet-page-heading">
                        <div>
                            <p className="sheet-eyebrow">Plan {plans.indexOf(activePlan) + 1}</p>
                            <h2>Edit your plan</h2>
                        </div>
                        <button
                            type="button"
                            className="sheet-back-btn"
                            onClick={() => setActivePlanId(null)}
                        >
                            All plans
                        </button>
                    </div>

                    <form className="sheet-editor-form" onSubmit={savePlan}>
                        <label htmlFor="sheet-title">Plan name</label>
                        <input
                            id="sheet-title"
                            className="sheet-input"
                            type="text"
                            value={draftTitle}
                            onChange={(event) => setDraftTitle(event.target.value)}
                            required
                            autoFocus
                        />

                        <label htmlFor="sheet-details">Plan details</label>
                        <textarea
                            id="sheet-details"
                            className="sheet-textarea"
                            value={draftDetails}
                            onChange={(event) => setDraftDetails(event.target.value)}
                            placeholder="Write the steps, notes, or ideas for this plan..."
                            rows={12}
                        />

                        <div className="sheet-editor-actions">
                            <button type="submit" className="sheet-save-btn">
                                Save plan
                            </button>
                            <button
                                type="button"
                                className="sheet-delete-btn"
                                onClick={() => deletePlan(activePlan)}
                            >
                                Delete plan
                            </button>
                        </div>
                    </form>
                </>
            ) : (
                <>
                    <div className="sheet-page-heading">
                        <div>
                            <p className="sheet-eyebrow">Your personal space : </p>
                            <h2 className='text-[12px] sm:text-[15px] text-amber-200 flex flex-col justify-center'>
                                <span>لَأَسْتَسْهِلَنَّ الصَّعْبَ أَوْ أُدْرِكَ الْمُنَى</span>
                               <span>فَمَا انْقَادَتِ الْآمَالُ إِلَّا لِصَابِرِ</span>
                            </h2>
                        </div>
                        <span className="sheet-count">{plans.length} saved</span>
                    </div>

                    <form className="sheet-add-form" onSubmit={addPlan}>
                        <label htmlFor="new-sheet-title">Start with a name</label>
                        <div className="sheet-add-row">
                            <input
                                id="new-sheet-title"
                                className="sheet-input "
                                type="text"
                                value={newTitle}
                                onChange={(event) => setNewTitle(event.target.value)}
                                placeholder="تعبُ اليومِ، مَجْدٌ لِلْغَدِ"
                                required
                            />
                            <button type="submit" className="sheet-save-btn">
                                Add plan
                            </button>
                        </div>
                    </form>

                    {plans.length > 0 ? (
                        <div className="sheet-grid">
                            {plans.map((plan, index) => (
                                <article className="sheet-card" key={plan.id}>
                                    <button
                                        type="button"
                                        className="sheet-card-open"
                                        onClick={() => openPlan(plan)}
                                        aria-label={`Open plan ${plan.title}`}
                                    >
                                        <span className="sheet-number">{index + 1}</span>
                                        <span className="sheet-card-title">{plan.title}</span>
                                        <span className="sheet-card-status">
                                            {plan.details.trim() ? 'Details saved' : 'Add details'}
                                        </span>
                                    </button>
                                    <button
                                        type="button"
                                        className="sheet-card-delete hover:bg-red-600 text-[#fecaca] 
                                        bg-blue-950 hover:text-red-100 active:bg-red-600 active:text-red-100 transition-all duration-300 "
                                        onClick={() => deletePlan(plan)}
                                        aria-label={`Delete plan ${plan.title}`}
                                    >
                                        ×
                                    </button>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <p className="sheet-empty-state flex flex-col justify-center items-center">
                            <span>لَوْلَا الْمَشَقَّةُ سَادَ النَّاسُ كُلُّهُمُ</span>
                            <span>الْجُودُ يُفْقِرُ وَالْإِقْدَامُ قَتَّالُ</span>
                        </p>
                    )}
                </>
            )}
        </section>
    )
}
