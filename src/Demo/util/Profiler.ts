namespace util {

    type Event = { label: string, time:number };
    type EventList = Event[];
    type EventListMap = { [key: string]: EventList };

    const CreateEvent = (label: string):Event => {
        return {
            label: label,
            time: window.performance.now()
        };
    };

    export const PrintEvents = (events: EventList): void =>
    {
        let offset:number|undefined;
        let data:string[] = [];

        for (let event of events) {
            if (!offset) {
                offset = event.time;
            }
            data.push(event.label + ": +" + (event.time - offset).toString());
        }

        console.log('evt', data.join("|"));
    }

    export const GetElapsedTime = (events: EventList): number =>
    {
        let from = events[0].time;
        let to = events[events.length-1].time;

        return to - from;
    }

    export class Profiler {
        private static _instance:Profiler;
        static instance(): Profiler
        {
            // FIXME jobb lenne factory?
            if (!this._instance) {
                this._instance = new Profiler();
            }

            return this._instance;
        }

        private events: EventListMap = {};
        private constructor() {}

        start(id: string): void {
            this.events[id] = [CreateEvent('start')];
        }

        snapshot(id: string, label: string):void {
            if (!this.events[id]) {
                return;
            }

            this.events[id].push(CreateEvent(label));
        }

        stop(id: string): EventList|undefined {
            if (!this.events[id]) {
                return;
            }

            this.events[id].push(CreateEvent('stop'));

            return this.get(id);
        }

        get(id:string): EventList|undefined {
            return this.events[id];
        }
    }
}