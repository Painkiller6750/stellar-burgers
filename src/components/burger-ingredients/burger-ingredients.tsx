import { useState, useRef, useEffect, FC } from 'react';
import { useInView } from 'react-intersection-observer';

import { TTabMode } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';
import { useSelector } from '../../services/store';

export const BurgerIngredients: FC = () => {
    // Get ingredients from Redux and split by type
    const ingredients = useSelector((state) => state.ingredients.ingredients);
    const buns = ingredients.filter((ingredient) => ingredient.type === 'bun');
    const mains = ingredients.filter((ingredient) => ingredient.type === 'main');
    const sauces = ingredients.filter((ingredient) => ingredient.type === 'sauce');

    // Current active tab state
    const [currentTab, setCurrentTab] = useState<TTabMode>('bun');

    // References to section headers for scrolling
    const titleBunRef = useRef<HTMLHeadingElement>(null);
    const titleMainRef = useRef<HTMLHeadingElement>(null);
    const titleSaucesRef = useRef<HTMLHeadingElement>(null);

    // Intersection observers for each ingredient section
    const [bunsRef, inViewBuns] = useInView({ threshold: 0 });
    const [mainsRef, inViewFilling] = useInView({ threshold: 0 });
    const [saucesRef, inViewSauces] = useInView({ threshold: 0 });

    // Sync tab with scroll position
    useEffect(() => {
        if (inViewBuns) {
            setCurrentTab('bun');
        } else if (inViewSauces) {
            setCurrentTab('sauce');
        } else if (inViewFilling) {
            setCurrentTab('main');
        }
    }, [inViewBuns, inViewFilling, inViewSauces]);

    /**
     * Handle tab click: update active tab and scroll to corresponding section.
     */
    const onTabClick = (tab: string) => {
        setCurrentTab(tab as TTabMode);

        if (tab === 'bun') {
            titleBunRef.current?.scrollIntoView({ behavior: 'smooth' });
        }

        if (tab === 'main') {
            titleMainRef.current?.scrollIntoView({ behavior: 'smooth' });
        }

        if (tab === 'sauce') {
            titleSaucesRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <BurgerIngredientsUI
            currentTab={currentTab}
            buns={buns}
            mains={mains}
            sauces={sauces}
            titleBunRef={titleBunRef}
            titleMainRef={titleMainRef}
            titleSaucesRef={titleSaucesRef}
            bunsRef={bunsRef}
            mainsRef={mainsRef}
            saucesRef={saucesRef}
            onTabClick={onTabClick}
        />
    );
};
