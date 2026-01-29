'use client'
import { cva } from 'class-variance-authority';

export function IntroSection() {

    const introSectionSt = cva('relative z-frontToCanvas w-full h-screen flex items-center justify-center');

    return (
        <section id="introSection" className={introSectionSt()}>
            <div className="text-box">
                <div className="text-box-face">
                    괴짜스러우나, 어쨌든 본적없는
                    의문스러우나, 어쨌든 쓸모있는
                    그런 웹서비스를 정성들여 만드는 
                    미니홈 방문에 감사드립니다.
                </div>
                <div className="text-box-face">
                    일단 만들어 볼까요?
                    당신의 개성을 소개하는 명함이 될수도 있습니다.
                    당신의 인연을 넓혀주는 우연이 될수도 있습니다.
                    오로지 당신을 위한 가장 개인적인 웹사이트를 가져보세요.
                </div>
            </div>

        </section>
    )


}