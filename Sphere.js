class Sphere {
    constructor(x, y, z) {
        this.r = 5;
        this.x = x;
        this.y = y;
        this.z = z;
        this.growing = true;
    }

    grow() {
        if(this.growing) {
            this.r += random(10);
        }
    }

    show() {
        translate(this.x, this.y, this.z);
        sphere(this.r, 400, 400);
        translate(this.x*-1, this.y*-1, this.z*-1);
    }

}