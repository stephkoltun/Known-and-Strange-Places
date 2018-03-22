//
//  ViewController.swift
//  Still-Life
//
//  Created by Patrick Burke on 2018-03-18.
//  Copyright © 2018 Patrick Burke. All rights reserved.
//

import UIKit
import SceneKit
import ARKit
import VideoToolbox

// Class is "ViewController"
// Inherits from "UIViewController", etc.
class ViewController: UIViewController, ARSCNViewDelegate, ARSessionDelegate
{

    // "@IBOutlet" allows the use of outlets and actions in Swift to connect the source code to interface objects
    // "sceneView" is an instance of the "ARSCNView" class
    // "!" is an implicitly unwrapped optional
    @IBOutlet var sceneView: ARSCNView!
    @IBOutlet weak var captureMode: UISegmentedControl!
    
    var mode = "compound"   // options: compound, camera, video
    
    // this is for tracking at what point a new video buffer should be appended to the video
    var timeSince = 0;
    var videoWriterObj: VideoWriter?
    var saveFrames = false
    
    var objectToMove : SCNNode?
    var zDepth : Float?
    
    
    
    // Function inherited from UIKit
    // "Override" inherited characteristics to perform additional initializations
    override func viewDidLoad()
    {
        super.viewDidLoad()
        
        // Set the view's delegate
        // Enables a class or struc to hand off some of its responsibilities to an instance of another type
        sceneView.delegate = self
        
        // Set the session's delegate
        sceneView.session.delegate = self
        
        // Show statistics such as fps and timing information
        sceneView.showsStatistics = false
        
        // Create a new scene
        // 3D SceneKit view
        let scene = SCNScene()
        
        // Set the scene to the view
        sceneView.scene = scene
        
        // use tapping to add and remove photos
        let tapGesture = UITapGestureRecognizer(target: self, action:
            #selector(ViewController.handleTap(gestureRecognize:)))
        view.addGestureRecognizer(tapGesture)
        
        // use panning to move them
        let panGesture = UIPanGestureRecognizer(
            target: self,
            action: #selector(ViewController.handlePan(gestureRecognize:))
        )
        view.addGestureRecognizer(panGesture)
        
        // add pressing for video
        let pressGesture = UILongPressGestureRecognizer(target: self, action:
            #selector(ViewController.handlePress(gestureRecognize:)))
        view.addGestureRecognizer(pressGesture)
        
    }
    
    
    // MARK: - Interactions
    // Change the modes for captureing
    @IBAction func modeDidTap(_ sender: Any) {
        switch captureMode.selectedSegmentIndex
        {
        case 0:
            mode = "compound"
        case 1:
            mode = "camera"
        case 2:
            mode = "video"
        default:
            break
        }
    }
    
    // Makes func available to Objective-C
    // "handleTap" is the function
    // "gestureRecognize" is the parameter name
    // "UITapGestureRecognizer" is the parameter type
    // Function doesn't return anything
    @objc
    func handleTap(gestureRecognize: UITapGestureRecognizer){
        
        // where did the user tap, relative to the AR scene?
        let tapLocation = gestureRecognize.location(in: sceneView)
        
        // check if it hit any nodes
        let hitTestResults = sceneView.hitTest(tapLocation)
        // upwrap the first node
        guard let node = hitTestResults.first?.node else {
            if mode != "video" {
                // if there are no nodes, add a capture
                addImageToScene()
            }
            return
        }
        // otherwise, remove it
        node.removeFromParentNode()
    }

    @objc
    func handlePan(gestureRecognize: UITapGestureRecognizer){
        
        if gestureRecognize.state == .began {
            print("pan start")
        
            // where did the user tap, relative to the AR scene?
            let touchLocation = gestureRecognize.location(in: sceneView)
            
            // check if it hit any nodes
            let hitTestResults = sceneView.hitTest(touchLocation)
            // upwrap the first node
            guard let node = hitTestResults.first?.node else {
                print("no nodes there...")
                // if there are no nodes, do nothing
                return
            }
            // otherwise, let's move it!
            objectToMove = node
            zDepth = sceneView.projectPoint(node.position).z

        }
        else if gestureRecognize.state == .ended || gestureRecognize.state == .changed {
            guard let node = objectToMove else {
                print("no node associated for moving...")
                return
            }
            
            // where did the user tap, relative to the AR scene?
            let touchLocation = gestureRecognize.location(in: sceneView)
            
            let newPostion = SCNVector3(
                x: Float(touchLocation.x),
                y: Float(touchLocation.y),
                z: zDepth!
            )
            node.position = sceneView.unprojectPoint(newPostion)
        }
    }
    
    @objc
    func handlePress(gestureRecognize: UILongPressGestureRecognizer){
        guard let currentARFrame = sceneView.session.currentFrame else {
            return
        }
        
        if mode != "video" {
            return
        }
        
        let currentBuffer = currentARFrame.capturedImage
        
        if gestureRecognize.state == .began {
            print("long press start")
            
            saveFrames = true
            timeSince = 0
            
            let bufferWidth = CVPixelBufferGetWidth(currentBuffer)
            let bufferHeight = CVPixelBufferGetHeight(currentBuffer)
            
            // VIDEO WRITER SETUP
            // base this off THIS example
            // https://stackoverflow.com/questions/3741323/how-do-i-export-uiimage-array-as-a-movie
            // adjust the settings for the class
            let settings = VideoWriter.videoSettings(width: bufferWidth, height: bufferHeight)
            // call a function to return a file path that we'll use to save the video
            let targetUrl = NSURL(fileURLWithPath: self.filePath())
            // Note: There should be no file at the targetUrl or nothing will be written.
            
            // initialize our video writer
            videoWriterObj = VideoWriter(url: targetUrl as URL, vidSettings: settings)
            let durationPerFrame = 0.016667 // 1/60 = 60 frames per second
            
            // temporarily say we're going to save 1 second of video (60 frames per second)
            guard let videoWrite = videoWriterObj else {
                return
            }
            videoWrite.applyTimeWith(duration: durationPerFrame, frameNumber: 120)
            
            videoWrite.assetWriter.startWriting()
            videoWrite.assetWriter.startSession(atSourceTime: kCMTimeZero)
            
            
        } else if gestureRecognize.state == .ended {
            print("long press end")
            
            // stop recording
            saveFrames = false
            
            guard let videoWrite = videoWriterObj else {
                return
            }
            
            // tell the writer that no more buffers will be appended to the input
            videoWrite.writerInput.markAsFinished()
            // Marks all unfinished inputs as finished and completes the writing of the output file.
            // More work to do for this point - not convinced I've done everything that needs to happen
            videoWrite.assetWriter.finishWriting {
                DispatchQueue.main.async {
                    print("completed")
                    self.addVideoToScene()
                }
            }
        }
    }
    
    
    // MARK: - Nodes
    func addImageToScene() {
        guard let currentARFrame = sceneView.session.currentFrame else {
            return
        }
        
        // Create an image plane using a snapshot of the view
        let imagePlane = SCNPlane(width: sceneView.bounds.width / 2500,
                                  height: sceneView.bounds.height / 2500)
        imagePlane.firstMaterial?.lightingModel = .constant
        
        if mode == "camera" {
            // use just the camera stream as the image
            let buffer = currentARFrame.capturedImage
            var cgImage: CGImage?
            VTCreateCGImageFromCVPixelBuffer(buffer, nil, &cgImage)
            
            imagePlane.firstMaterial?.diffuse.contents = cgImage
        } else if mode == "compound" {
            // use the AR scene as the image, compounding any existing nodes
            imagePlane.firstMaterial?.diffuse.contents = sceneView.snapshot()
        }
        
        // Create a plane node and add it to the scene
        let planeNode = SCNNode()
        planeNode.geometry = imagePlane
        sceneView.scene.rootNode.addChildNode(planeNode)
        
        // Set transform of node to be 10cm in front of camera
        var translation = matrix_identity_float4x4
        translation.columns.3.z = -0.15
        planeNode.simdTransform = matrix_multiply(currentARFrame.camera.transform, translation)
    }
    
    func addVideoToScene() {
        guard let videoWrite = videoWriterObj else {
            return
        }
        
        guard let currentARFrame = sceneView.session.currentFrame else {
            return
        }
        
        let videoPath = videoWrite.fileURL
        let videoPlayer = AVPlayer(url: videoPath!)
        let resolution = self.resolutionForLocalVideo(url: videoPath!)
        let vidWidth = resolution?.width
        let vidHeight = resolution?.height
        
        // this uses an observer
        // NEED TO UNDERSTAND WHAT THE HELL IS GOING ON HERE
        // add an observer for the "AVPlanterItemDidPlayToEndTime" notification that comes from the video player we set up
        // when the notification is observered, use the playerItemDidReachEnd callback function that we wrote
        videoPlayer.actionAtItemEnd = .none
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(ViewController.playerItemDidReachEnd),  //specifies the message the receiver sends observer to notify it of the notification posting
            name: NSNotification.Name.AVPlayerItemDidPlayToEndTime, //name of the notification for which to register the observe
            object: videoPlayer.currentItem // object whose notifications the observer wants to receive
        )
        
        
        // create spritekit scene
        // set it to whatever size we want
        // we're going to add the video node to this, because video nodes dont exist in SceneKit scenes
        let spriteKitScene = SKScene(
            size: CGSize(
                width: vidWidth!,
                height: vidHeight!
            )
        )
        
        // Create the SpriteKit video node, containing the video player
        let videoSpriteKitNode = SKVideoNode(avPlayer: videoPlayer)
        // set the video node to be positioned in the middle of the scene
        videoSpriteKitNode.position = CGPoint(
            x: spriteKitScene.size.width / 2.0,
            y: spriteKitScene.size.height / 2.0
        )
        // set the video to the same size as the spritekit scene
        videoSpriteKitNode.size = spriteKitScene.size
        // make the video play as soon as it's rendered to the screen
        videoSpriteKitNode.play()
        // add the video node to the sprite kit scene
        spriteKitScene.addChild(videoSpriteKitNode)
        
        
        // Create a SceneKit plane and add the SpriteKit scene as its material
        // create a video plane for us to place the sprikeKit scene onto
        let videoPlane = SCNPlane(width: self.sceneView.bounds.width / 2000,
                                  height: self.sceneView.bounds.height / 2000)
        // set the material contents of the plane to the sprite kit scene
        videoPlane.firstMaterial?.diffuse.contents = spriteKitScene
        videoPlane.firstMaterial?.isDoubleSided = true
        videoPlane.firstMaterial?.lightingModel = .constant
        
        // Create a node for the plane and add it to the scene
        // assign the videoPlane as the geometry for the node
        let videoPlaneNode = SCNNode(geometry: videoPlane)
        // add the videoPlaneNode to our scene
        self.sceneView.scene.rootNode.addChildNode(videoPlaneNode)
        
        
        // Set transform of node to be 40cm "in front" of camera
        var translation = matrix_identity_float4x4
        translation.columns.3.z = -0.1
        videoPlaneNode.simdTransform = matrix_multiply(currentARFrame.camera.transform, translation)
        videoPlaneNode.eulerAngles = SCNVector3(Double.pi,0,0)
    }
    
    

    
    // MARK: - Helper Functions
    
    // This callback will restart the video when it has reach its end
    @objc
    func playerItemDidReachEnd(notification: NSNotification) {
        if let playerItem: AVPlayerItem = notification.object as? AVPlayerItem {
            playerItem.seek(to: kCMTimeZero, completionHandler: nil)
        }
    }
    
    func resolutionForLocalVideo(url: URL) -> CGSize? {
        guard let track = AVURLAsset(url: url).tracks(withMediaType: AVMediaType.video).first else { return nil }
        let size = track.naturalSize.applying(track.preferredTransform)
        return CGSize(width: fabs(size.width), height: fabs(size.height))
    }
    
    func filePath() -> String {
        let paths = NSSearchPathForDirectoriesInDomains(.documentDirectory, .userDomainMask, true)
        let documentsDirectory = paths[0] as String
        let currentDateTime = Date()
        let filePath : String = "\(documentsDirectory)/\(currentDateTime.debugDescription)-video.mp4"
        print(filePath)
        return filePath
    }
    
    
    
    // MARK: - View Initializations and Handlers
    
    // Function with one parameter
    // "Override" inherited characteristics
    override func viewWillAppear(_ animated: Bool)
    {
        super.viewWillAppear(animated)
        
        // Create a session configuration
        let configuration = ARWorldTrackingConfiguration()

        // Run the view's session
        sceneView.session.run(configuration)
    }
    
    // Function with one parameter
    // "Override" inherited characteristics
    override func viewWillDisappear(_ animated: Bool)
    {
        super.viewWillDisappear(animated)
        // Pause the view's session
        sceneView.session.pause()
    }
    
    override func didReceiveMemoryWarning()
    {
        super.didReceiveMemoryWarning()
        // Release any cached data, images, etc that aren't in use.
    }


    // MARK: - ARSCNViewDelegate
    func session(_ session: ARSession, didUpdate newFrame: ARFrame) {
        // if long press is active, pipe the frame buffers to a video
        if saveFrames && mode == "video" {
            print("save frame")
            
            // check that the video writer object has been instantiated
            guard let videoWrite = videoWriterObj else {
                return
            }
            
            // carry on...
            let currentBuffer = newFrame.capturedImage
            // check if the av writer input is available for more data
            if videoWrite.writerInput.isReadyForMoreMediaData {
                
                var sampleBuffer: CVPixelBuffer?
                
                // i think this has to do with threading
                autoreleasepool(invoking: {
                    
                    sampleBuffer = currentBuffer
                    
                }) // End of autoreleasepool
                
                if sampleBuffer != nil {
                    
                    let value = timeSince
                    let lastTime = CMTimeMake(Int64(value), videoWrite.frameTime.timescale)
                    let presentTime = CMTimeAdd(lastTime, videoWrite.frameTime)
                    
                    let result = videoWrite.bufferAdapter.append(sampleBuffer!, withPresentationTime: presentTime)
                    // after a while this ends up being false...
                    if (result == false) {
                        print("failed. buffer not added")
                    } else {
                        print("success!")
                        timeSince += 1
                    }
                }
            } else {
                print("writer input isn't ready")
            }// End of isReadyForMoreMediaData
        }
    }
    
    func session(_ session: ARSession, didFailWithError error: Error)
    {
        // Present an error message to the user
    }
    
    func sessionWasInterrupted(_ session: ARSession)
    {
        // Inform the user that the session has been interrupted, for example, by presenting an overlay
    }
    
    func sessionInterruptionEnded(_ session: ARSession)
    {
        // Reset tracking and/or remove existing anchors if consistent tracking is required
    }
}

// Custom Class for Writing Videos

class VideoWriter {
    var assetWriter: AVAssetWriter
    var writerInput: AVAssetWriterInput
    var bufferAdapter: AVAssetWriterInputPixelBufferAdaptor!
    var videoSettings: [String : Any]
    var frameTime: CMTime!
    var fileURL: URL!
    
    // this is the initialization function
    init(url: URL, vidSettings: [String: Any]) {
        self.assetWriter = try! AVAssetWriter(url: url, fileType: AVFileType.mov)
        self.fileURL = url
        self.videoSettings = vidSettings
        self.writerInput = AVAssetWriterInput(mediaType: AVMediaType.video, outputSettings: self.videoSettings)
        
        assert(self.assetWriter.canAdd(self.writerInput), "Writer cannot add input")
        self.assetWriter.add(self.writerInput)
        
        let bufferAttributes = [kCVPixelBufferPixelFormatTypeKey as String : Int(kCVPixelFormatType_32ARGB)]
        self.bufferAdapter = AVAssetWriterInputPixelBufferAdaptor(assetWriterInput: self.writerInput, sourcePixelBufferAttributes: bufferAttributes)
        self.frameTime = CMTimeMake(1, 5) // Default value, use 'applyTimeWith(duration:)'
    }
    
    static func videoSettings(codec: String = AVVideoCodecJPEG, width: Int, height: Int) -> [String : Any] {
        // AVVideoCodecJPEG also works, but result in a much bigger file.
        return [
            AVVideoCodecKey : AVVideoCodecH264, //AVVideoCodecJPEG,
            AVVideoWidthKey : width,
            AVVideoHeightKey : height
        ]
    }
    
    /**
     Update the movie time with the number of images and the duration per image.
     - Parameter duration: The duration per frame (image)
     - Parameter frameNumber: The number of frames (images)
     */
    func applyTimeWith(duration: Double, frameNumber: Int) {
        let scale = Float(frameNumber) / (Float(frameNumber) * Float(duration))
        self.frameTime = CMTimeMake(1, Int32(scale))
    }
}
